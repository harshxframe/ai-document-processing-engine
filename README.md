# AI Document Processing Eng

An asynchronous document processing engine that converts PDF documents into searchable vector embeddings and enables conversational question answering using Retrieval-Augmented Generation (RAG).

The project is built with scalability in mind using a queue-based architecture so that document ingestion and user requests remain independent.

---

## Features

- PDF Upload API
- Background processing using BullMQ workers
- PDF text extraction
- Page cleaning & preprocessing
- Intelligent text chunking
- Local embedding generation using Ollama (bge-m3)
- Vector storage with Qdrant
- Semantic retrieval
- Conversational document chat
- Redis-based job status tracking
- Temporary file cleanup after processing

---

## Architecture

### Ingestion Pipeline
```text
                    Upload PDF
                         │
                         ▼
                 Express Upload API
                         │
                         ▼
                  Store Job Status
                       (Redis)
                         │
                         ▼
                    BullMQ Queue
                         │
                         ▼
                Background Worker
                         │
                         ▼
                  PDF Text Parser
                         │
                         ▼
                 Clean & Normalize
                         │
                         ▼
                    Text Chunking
                         │
                         ▼
              Ollama Embeddings (bge-m3)
                         │
                         ▼
                  Batch Vector Indexing
                         │
                         ▼
                     Qdrant Database
```

### Retrieval & RAG Pipeline
```text
                 User Question
                         │
                         ▼
                Generate Embedding
                         │
                         ▼
             Semantic Search (Qdrant)
                         │
                         ▼
             Retrieve Relevant Chunks
                         │
                         ▼
                 Build Prompt
                         │
                         ▼
                      AI Model
                         │
                         ▼
                  Final Response
```

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Cache & Queue:** Redis, BullMQ
- **Vector Database:** Qdrant
- **LLM Engine:** Ollama (`bge-m3` Embedding Model)

---

## Embedding Model

The project currently uses **bge-m3** running locally through Ollama. Embeddings are generated in batches before indexing into Qdrant.

---

## Vector Database

This project uses **Qdrant** as the vector database. Each indexed point stores:

- `documentId`
- `page`
- `chunkIndex`
- `text`
- `embedding vector`

Semantic retrieval is filtered using the uploaded document ID before sending the final context to the language model.

---

## Queue Processing

Document ingestion is completely asynchronous.

```text
Upload ──> Queue ──> Worker ──> Embedding ──> Vector Storage
```

This keeps upload latency low while heavy AI processing happens in the background.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=2020
BASE_URL=
AI_API_KEY=
```

---

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start external services:**
   - Start **Redis**
   - Start **Qdrant**
   - Start **Ollama**

3. **Pull the embedding model:**
   ```bash
   ollama pull bge-m3
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

---

## Testing

A simple terminal client `testNow.js` is included. After starting the server, run:

```bash
node testNow.js
```

The script automatically:
- Uploads a PDF // Change the file path before running..
- Waits until processing completes
- Opens an interactive terminal chat

This makes it easy to test the complete RAG pipeline end-to-end.

---

## Future Improvements

- Docker Compose setup for easy orchestration
- Streaming responses for the chat API
- Multi-user authentication & tenancy
- Support for multiple embedding providers and vector databases
- OCR support for scanned PDFs
- Hybrid search (sparse/dense vectors) & metadata filtering
- Horizontal scaling for BullMQ workers
- Cloud object storage support (S3, Google Cloud Storage)

---

## Project Goal

The goal of this project was to build a scalable Retrieval-Augmented Generation (RAG) pipeline instead of only creating a basic PDF chat application. 

The focus was on building a production-oriented ingestion pipeline using asynchronous workers, semantic indexing, and vector retrieval that can later be extended for large-scale deployments.
