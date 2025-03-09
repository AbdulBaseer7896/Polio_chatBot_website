

from flask import Flask, render_template, request, session
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
from groq import Groq
import os
import logging

app = Flask(__name__)
app.secret_key = 'your_secret_key3'  # Needed for session management

# Configuration
MAX_QUERY_LENGTH = 500
GROQ_MODEL = "mixtral-8x7b-32768"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
SEARCH_K = 1
EMBEDDING_DIM = 384
MODEL_DEVICE = 'cpu'

# File paths
FAISS_INDEX_FILE = "polio_faiss_index.index"
EMBEDDINGS_FILE = "polio_embeddings.npy"
TEXT_CHUNKS_FILE = "document_texts.npy"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize resources at startup
try:
    logger.info("Loading FAISS index and model...")
    
    # Load model with memory optimization
    model = SentenceTransformer(EMBEDDING_MODEL, device=MODEL_DEVICE)
    model.max_seq_length = 128
    
    # Load FAISS index and text chunks
    index = faiss.read_index(FAISS_INDEX_FILE)
    text_chunks = np.load(TEXT_CHUNKS_FILE, allow_pickle=True)
    
    # Load and immediately release embeddings
    embeddings = np.load(EMBEDDINGS_FILE)
    del embeddings  # Proper memory release
    
except Exception as e:
    logger.critical(f"Initialization failed: {str(e)}")
    raise

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", "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"))

def process_query(query, conversation_history):
    logger.info("Processing query with conversation history.")
    
    # Truncate query to maximum allowed length
    query = query.strip()[:MAX_QUERY_LENGTH]
    if not query:
        return "Please enter a valid question about polio."
    
    # Compute query embedding
    with torch.inference_mode():
        query_embedding = model.encode(
            [query],
            normalize_embeddings=True,
            convert_to_numpy=True,
            show_progress_bar=False,
            batch_size=1
        )
    
    distances, indices = index.search(query_embedding.astype('float32'), SEARCH_K)
    valid_indices = [idx for idx in indices[0] if 0 <= idx < len(text_chunks)][:2]
    context = " ".join(text_chunks[idx] for idx in valid_indices)
    
    # Build conversation string from history
    conversation_str = ""
    for msg in conversation_history:
        role = "User" if msg["role"] == "user" else "Assistant"
        conversation_str += f"{role}: {msg['content']}\n"
    
    # Create the prompt by combining instructions, context, previous conversation, and the current query
    prompt = f"""###INSTRUCTIONS###
    1. Determine if the query is related to polio, vaccines, or public health initiatives.
    2. If the query is UNRELATED, respond ONLY with: "I am a specialized assistant for polio-related information. Please ask questions about polio eradication, vaccination, or related public health initiatives."
    3. If the query is RELATED, provide a direct, concise answer using the provided context and conversation history. Do NOT include any meta commentary, analysis, or explanations about how the query relates to polio—simply answer the question.

    ###CONTEXT###
    {context}

    ###CONVERSATION HISTORY###
    {conversation_str}

    ###CURRENT QUERY###
    {query}

    ###RESPONSE FORMAT###
    <response>Your direct final answer here</response>"""

    
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return "Our systems are busy. Please try again."
@app.route("/")
def home():
    if 'conversation' not in session:
        session['conversation'] = []
    return render_template("index.html", conversation=session['conversation'])


@app.route("/new_chat", methods=["POST"])
def new_chat():
    session.pop('conversation', None)  # Clears the conversation
    return render_template("index.html", conversation=[])


@app.route("/ask", methods=["POST"])
def ask():
    try:
        if 'conversation' not in session:
            session['conversation'] = []
        conversation = session['conversation']

        query = request.form["query"].strip()[:MAX_QUERY_LENGTH]
        if not query:
            return render_template("index.html", error="Please enter a question", conversation=conversation)
        
        # Append user's message to conversation history
        conversation.append({"role": "user", "content": query})

        # Process the query including conversation history
        response_text = process_query(query, conversation)

        # Append assistant's response to conversation history
        conversation.append({"role": "assistant", "content": response_text})
        session['conversation'] = conversation

        return render_template("index.html", conversation=conversation)
    
    except Exception as e:
        logger.error(f"Request error: {str(e)}")
        return render_template("index.html", error="Temporary service interruption", conversation=session.get('conversation', []))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 20000))
    app.run(host="0.0.0.0", port=port, threaded=False)

