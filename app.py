# # # app.py (final working version)
# # from flask import Flask, render_template, request
# # from flask_caching import Cache
# # import faiss
# # import numpy as np
# # from sentence_transformers import SentenceTransformer
# # import torch
# # from groq import Groq
# # import os
# # from tenacity import retry, stop_after_attempt, wait_exponential

# # app = Flask(__name__)
# # cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})
# # cache.init_app(app)

# # # Configuration
# # MAX_QUERY_LENGTH = 500
# # GROQ_MODEL = "mixtral-8x7b-32768"
# # EMBEDDING_MODEL = "all-MiniLM-L6-v2"
# # SEARCH_K = 5  # Reduced from 8

# # # File paths
# # FAISS_INDEX_FILE = "polio_faiss_index.index"
# # EMBEDDINGS_FILE = "polio_embeddings.npy"
# # TEXT_CHUNKS_FILE = "document_texts.npy"

# # def load_resources():
# #     """Load resources with error handling"""
# #     try:
# #         device = 'cuda' if torch.cuda.is_available() else 'cpu'
# #         return (
# #             faiss.read_index(FAISS_INDEX_FILE),
# #             np.load(EMBEDDINGS_FILE),
# #             np.load(TEXT_CHUNKS_FILE, allow_pickle=True),
# #             SentenceTransformer(EMBEDDING_MODEL, device=device)
# #         )
# #     except Exception as e:
# #         app.logger.error(f"Failed loading resources: {str(e)}")
# #         raise RuntimeError("System initialization failed - contact support")

# # index, embeddings, text_chunks, model = load_resources()
# # groq_client = Groq(api_key="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")

# # @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=10))
# # def get_groq_response(prompt):
# #     return groq_client.chat.completions.create(
# #         model=GROQ_MODEL,
# #         messages=[{
# #             "role": "system",
# #             "content": "You are a polio information specialist. First determine question relevance."
# #         }, {
# #             "role": "user", 
# #             "content": prompt
# #         }],
# #         temperature=0.3,
# #         max_tokens=350,
# #         request_timeout=20
# #     )

# # def process_query(query):
# #     # try:
# #         query = query.strip()[:MAX_QUERY_LENGTH]
# #         if not query:
# #             return "Please enter a valid question about polio."
        
# #         # Generate embedding
# #         query_embedding = model.encode([query], 
# #                                      normalize_embeddings=True, 
# #                                      convert_to_numpy=True,
# #                                      show_progress_bar=False)
        
# #         # Simplified FAISS search without parameter tuning
# #         distances, indices = index.search(query_embedding, SEARCH_K)
        
# #         # Context processing
# #         valid_indices = [idx for idx in indices[0] if 0 <= idx < len(text_chunks)]
# #         if not valid_indices:
# #             return "I specialize in polio-related information. How can I help with polio eradication or vaccination?"
        
# #         context = " ".join(text_chunks[idx] for idx in valid_indices[:3])  # Use top 3 results

# #         # Optimized prompt
# #         prompt = f"""**POLIO QUESTION**
# # {query}

# # **RELEVANT CONTEXT**
# # {context[:1200]}

# # **INSTRUCTIONS**
# # 1. If unrelated to polio, respond: "I specialize in polio information."
# # 2. If related, provide 2-3 sentence answer using the context."""

# #         response = get_groq_response(prompt)
# #         return response.choices[0].message.content.split('\n')[-1].strip()
    
# #     # except Exception as e:
# #     #     print(e)
# #     #     app.logger.error(f"Query processing error: {str(e)}")
# #     #     return "Our systems are busy. Please try again in a moment."

# # def format_response(response):
# #     return response.replace("\n", "<br>")

# # @app.route("/")
# # def home():
# #     return render_template("index.html")

# # @app.route("/ask", methods=["POST"])
# # @cache.cached(timeout=300, query_string=True)
# # def ask():
# #     # try:
# #         query = request.form["query"][:MAX_QUERY_LENGTH].strip()
# #         if not query:
# #             return render_template("index.html", error="Please enter a question")
            
# #         response = process_query(query)
# #         return render_template("index.html", 
# #                              response=format_response(response),
# #                              query=query)
    
# #     # except Exception as e:
# #     #     app.logger.error(f"Request error: {str(e)}")
# #     #     return render_template("index.html", 
# #     #                          error="Technical difficulty - our team has been notified")

# # if __name__ == "__main__":
# #     port = int(os.environ.get("PORT", 20000))
# #     app.run(host="0.0.0.0", port=port)




# # app.py
# from flask import Flask, render_template, request
# from flask_caching import Cache
# import faiss
# import numpy as np
# from sentence_transformers import SentenceTransformer
# import torch
# from groq import Groq
# import os
# from tenacity import retry, stop_after_attempt, wait_exponential
# import logging

# app = Flask(__name__)
# cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})
# cache.init_app(app)


# cache = Cache(config={
#     'CACHE_TYPE': 'SimpleCache',
#     'CACHE_DEFAULT_TIMEOUT': 300,
#     'CACHE_IGNORE_ERRORS': True,
#     'CACHE_KEY_PREFIX': 'polio_'
# })

# # Configuration
# MAX_QUERY_LENGTH = 500
# GROQ_MODEL = "mixtral-8x7b-32768"
# EMBEDDING_MODEL = "all-MiniLM-L6-v2"
# SEARCH_K = 5
# EMBEDDING_DIM = 384  # For all-MiniLM-L6-v2 model

# # File paths
# FAISS_INDEX_FILE = "polio_faiss_index.index"
# EMBEDDINGS_FILE = "polio_embeddings.npy"
# TEXT_CHUNKS_FILE = "document_texts.npy"

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def load_resources():
#     """Load resources with dimension verification and error handling"""
#     try:
#         logger.info("Loading FAISS index and embeddings...")
#         index = faiss.read_index(FAISS_INDEX_FILE)
#         embeddings = np.load(EMBEDDINGS_FILE)
#         text_chunks = np.load(TEXT_CHUNKS_FILE, allow_pickle=True)
        
#         # Initialize model with device detection
#         device = 'cuda' if torch.cuda.is_available() else 'cpu'
#         model = SentenceTransformer(EMBEDDING_MODEL, device=device)
        
#         # Dimension verification
#         if model.get_sentence_embedding_dimension() != EMBEDDING_DIM:
#             raise ValueError(f"Model dimension mismatch: Expected {EMBEDDING_DIM}, "
#                              f"got {model.get_sentence_embedding_dimension()}")
            
#         if index.d != EMBEDDING_DIM:
#             raise ValueError(f"FAISS index dimension mismatch: Expected {EMBEDDING_DIM}, "
#                              f"got {index.d}")

#         logger.info("Resources loaded successfully")
#         return index, embeddings, text_chunks, model

#     except Exception as e:
#         logger.error(f"Resource loading failed: {str(e)}")
#         raise RuntimeError("System initialization failed - contact support")

# # Initialize resources
# try:
#     index, embeddings, text_chunks, model = load_resources()
# except Exception as e:
#     logger.critical(f"Critical initialization error: {str(e)}")
#     raise

# # Initialize Groq client
# groq_client = Groq(api_key="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")

# @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=10))
# def get_groq_response(prompt):
#     """Get response from Groq API with error handling"""
#     try:
#         return groq_client.chat.completions.create(
#             model=GROQ_MODEL,
#             messages=[{
#                 "role": "system",
#                 "content": "You are a polio information specialist. First determine question relevance."
#             }, {
#                 "role": "user", 
#                 "content": prompt
#             }],
#             temperature=0.3,
#             max_tokens=350,
#             # request_timeout=20
#         )
#     except Exception as e:
#         logger.error(f"Groq API error: {str(e)}")
#         raise

# def process_query(query):
#         """Process user query with comprehensive error handling"""
#     # try:
#         # Validate input
#         query = query.strip()[:MAX_QUERY_LENGTH]
#         if not query:
#             return "Please enter a valid question about polio."

#         # Generate embedding
#         query_embedding = model.encode([query], 
#                                      normalize_embeddings=True, 
#                                      convert_to_numpy=True,
#                                      show_progress_bar=False)
        
#         # Validate embedding dimensions
#         if query_embedding.shape[1] != EMBEDDING_DIM:
#             raise ValueError(f"Embedding dimension mismatch: {query_embedding.shape[1]} != {EMBEDDING_DIM}")

#         # FAISS search
#         query_embedding = query_embedding.astype('float32')
#         distances, indices = index.search(query_embedding, SEARCH_K)

#         # Process results
#         valid_indices = [idx for idx in indices[0] if 0 <= idx < len(text_chunks)]
#         if not valid_indices:
#             return "I specialize in polio-related information. How can I help with polio eradication or vaccination?"

#         context = " ".join(text_chunks[idx] for idx in valid_indices[:3])
#         print("This is the contaext = " , context  )
#         print("This is the querry = " , query)

#         # Create prompt
#         prompt = f"""###INSTRUCTIONS###
#             1. FIRST analyze if this query relates to polio, vaccines, or public health initiatives
#             2. If UNRELATED, respond ONLY with: "I am a specialized assistant for polio-related information. Please ask questions about polio eradication, vaccination, or related public health initiatives."
#             3. If RELATED, provide a helpful answer using this context:

#             ###CONTEXT###
#             {context}

#             ###QUERY###
#             {query}
#             ###RESPONSE FORMAT###
#             <analysis>Brief relevance assessment</analysis>
#             <response>Your final answer here</response>"""


#         # Get response
#         response = get_groq_response(prompt)
#         return response.choices[0].message.content.split('\n')[-1].strip()

#     # except Exception as e:
#     #     logger.error(f"Query processing error: {str(e)}")
#     #     return "Our systems are busy. Please try again in a moment."

# def format_response(response):
#     """Format response for HTML display"""
#     return response.replace("\n", "<br>")

# @app.route("/")
# def home():
#     return render_template("index.html")

# @app.route("/ask", methods=["POST"])
# def ask():
#     # try:
#         query = request.form["query"][:MAX_QUERY_LENGTH].strip()
#         if not query:
#             return render_template("index.html", error="Please enter a question")
            
#         response = process_query(query)
#         return render_template("index.html", 
#                              response=format_response(response),
#                              query=query)
    
#     # except Exception as e:
#     #     logger.error(f"Request error: {str(e)}")
#     #     return render_template("index.html", 
#     #                          error="Technical difficulty - our team has been notified")

# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 20000))
#     app.run(host="0.0.0.0", port=port, threaded=True)

# app.py - Corrected Version
from flask import Flask, render_template, request
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
from groq import Groq
import os
import logging

app = Flask(__name__)

# Configuration
MAX_QUERY_LENGTH = 500
GROQ_MODEL = "mixtral-8x7b-32768"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
SEARCH_K = 3
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

def process_query(query):
    print("This is the querry = " ,query)
    try:
        query = query.strip()[:MAX_QUERY_LENGTH]
        if not query:
            return "Please enter a valid question about polio."

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

        prompt =  f"""###INSTRUCTIONS###
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
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    try:
        query = request.form["query"].strip()[:MAX_QUERY_LENGTH]
        if not query:
            return render_template("index.html", error="Please enter a question")
            
        response = process_query(query)
        return render_template("index.html", 
                            response=response.replace("\n", "<br>"),
                            query=query)
    
    except Exception as e:
        logger.error(f"Request error: {str(e)}")
        return render_template("index.html", 
                            error="Temporary service interruption")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 20000))
    app.run(host="0.0.0.0", port=port, threaded=False)