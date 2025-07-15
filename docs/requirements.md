# Smart Notes - Requirements Document

## 📋 Functional Requirements

### 1. Core Features

#### Unified Note/Task/Chat Interface (Chrome Extension)
- Single interface combining note-taking and chat functionality
- Users can:
  - Create text-based notes, tasks, or reminders
  - Chat with the AI assistant in the same interface
  - Reference previous notes in the chat context
- Each entry can include:
  - Due date/time
  - Tags or categories (e.g., "Work", "Personal")
  - Priority level

#### AI-Powered Chat Assistant
- Integrated directly into the Chrome Extension
- Natural language understanding for:
  - Querying existing notes (e.g., "Show me notes about project X")
  - Task management (e.g., "What's on my to-do list for tomorrow?")
  - Context-aware suggestions based on current browsing context
- Powered by Cloudflare Workers AI for RAG (Retrieval-Augmented Generation)

## 🛠 Technical Requirements

### 1. Frontend

#### Chrome Extension
- Built with WXT (Web eXtension Toolkit) + React
- Unified interface for both note-taking and chat
- Components:
  - Combined chat/note input area
  - Message/note history view
  - Quick actions for common tasks
  - Settings and preferences
- Syncs with the backend via API

### 2. Backend Services

#### Cloudflare Workers
- Serverless functions for handling API requests
- Authentication and authorization
- Integration with Cloudflare's AI models
- Rate limiting and security

#### Vector Database (Cloudflare D1 with Vector Extension)
- Store and query document embeddings
- Efficient similarity search for RAG
- Local-first architecture with cloud sync

#### RAG Pipeline with Cloudflare AI
- Embedding model: Cloudflare's built-in text embedding
- Vector search using Cloudflare's infrastructure
- Local LLM inference for privacy and performance
- Context-aware response generation

## 🧠 System Workflow

### 1. Add Note/Task
1. User inputs via Chrome Extension
2. Content is processed locally for immediate feedback
3. Data is synced to Cloudflare Workers
4. Embeddings are generated and stored in Cloudflare D1
5. Metadata is updated (type, date, tags, etc.)

### 2. Query Chat Assistant
1. User types a question or command
2. Query is processed locally when possible
3. For complex queries:
   - Query is embedded using Cloudflare's AI
   - Vector DB is searched for relevant context
   - Context is fed to the local LLM
   - Response is generated and displayed

## 📐 Architecture Overview

```
[ Chrome Extension ]
         |
         | (Local Processing + Cloud Sync)
         |
[ Cloudflare Workers AI ]
         |
    ┌────┴────┐
    |         |
[ Cloudflare D1 ]  [ AI Models ]
    (Vector DB)     (Local LLM)
```

## 🧪 Additional Features (Future Ideas)
- 🔔 Browser-based notifications for tasks
- 🌐 Context capture from active tabs
- 🔄 Cross-device sync
- 🔍 Advanced search with semantic understanding
- 📊 Usage analytics (privacy-focused)

## ✅ Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React, WXT (Chrome Extension) |
| Backend | Cloudflare Workers |
| Database | Cloudflare D1 with Vector Extension |
| AI/ML | Cloudflare Workers AI |
| Authentication | Cloudflare Access |
| Hosting | Cloudflare Edge Network |

## 🔒 Privacy & Security
- All processing happens as close to the user as possible
- End-to-end encryption for sensitive data
- Local-first architecture with optional cloud sync
- No data mining or selling of user data
