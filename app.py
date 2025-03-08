from flask import Flask, render_template, request
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
from groq import Groq
import os

app = Flask(__name__)

# File paths
FAISS_INDEX_FILE = "polio_faiss_index.index"
EMBEDDINGS_FILE = "polio_embeddings.npy"
TEXT_CHUNKS_FILE = "document_texts.npy"  # New file with saved text chunks

def load_resources():
    """Load all required resources once"""
    index = faiss.read_index(FAISS_INDEX_FILE)
    embeddings = np.load(EMBEDDINGS_FILE)
    text_chunks = np.load(TEXT_CHUNKS_FILE, allow_pickle=True)
    model = SentenceTransformer("BAAI/bge-base-en").to('cuda' if torch.cuda.is_available() else 'cpu')
    return index, embeddings, text_chunks, model

# Load resources at startup
index, embeddings, text_chunks, model = load_resources()
groq_client = Groq(api_key="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")

def process_query(query):
    # Existing encoding and search logic
    query_embedding = model.encode([query], normalize_embeddings=True, convert_to_numpy=True)
    distances, indices = index.search(query_embedding, k=8)
    valid_indices = [idx for idx in indices[0] if 0 <= idx < len(text_chunks)]
    
    if not valid_indices:
        return "I am a polio information assistant. This question appears to be outside my scope of expertise."

    context = " ".join([text_chunks[idx] for idx in valid_indices])

    # Single optimized prompt
    prompt = f"""###INSTRUCTIONS###
            1. FIRST analyze if this query relates to polio, vaccines, or public health initiatives
            2. If UNRELATED, respond ONLY with: "I am a specialized assistant for polio-related information. Please ask questions about polio eradication, vaccination, or related public health initiatives."
            3. If RELATED, provide a helpful answer using this context:

            ###CONTEXT###
            {context}

            ###QUERY###
            {query}
            ###RESPONSE FORMAT###
            <analysis>Brief relevance assessment</analysis>
            <response>Your final answer here</response>"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "system",
            "content": "You are a polio information specialist. First determine question relevance. Never answer non-polio questions."
        },{
            "role": "user", 
            "content": prompt
        }],
        temperature=0.3,  # Lower temp for more consistent structure
        max_tokens=500
    )

    full_response = response.choices[0].message.content.strip()
    
    # Extract response using the XML-like tags
    if "<response>" in full_response:
        final_response = full_response.split("<response>")[1].split("</response>")[0].strip()
        return final_response
    else:
        return "I am a specialized assistant for polio-related information. Please ask questions about polio eradication, vaccination, or related public health initiatives."

def format_response(response):
    return response.replace("\n", "<br>").replace("• ", "&bull; ")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    query = request.form["query"]
    try:
        response = process_query(query)
        return render_template("index.html", response=format_response(response))
    except Exception as e:
        return render_template("index.html", error=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 20000))
    app.run(host="0.0.0.0", port=port)