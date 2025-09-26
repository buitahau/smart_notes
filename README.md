# Smart Notes

AI-powered note-taking and task management Chrome extension with unified chat interface.

## Project Structure

- `frontend/` - Chrome extension built with WXT + React
- `backend/` - Cloudflare Workers API and services
- `ai/` - AI models and RAG pipeline implementation
- `docs/` - Project documentation and specifications

## Getting Started

Each folder contains its own README with specific setup instructions.

## Tech Stack

- Frontend: React, WXT (Chrome Extension)
- Backend: Express.js (Node.js)
- Database: Neon (PostgreSQL) with Drizzle ORM
- AI/ML: Cloudflare Workers AI / OpenAI

## Architect diagram
                   ┌──────────────────────────┐
                   │        User (App)        │
                   └───────────┬──────────────┘
                               │
                         (1) Add Task
                               │
                   ┌───────────▼──────────────┐
                   │    Cloudflare Worker     │
                   │  (API / business logic)  │
                   └───────────┬──────────────┘
            ┌──────────────────┼───────────────────┐
            │                  │                   │
    (2) Insert Task     (3) Generate Embedding     │
    into Main DB        (Workers AI / OpenAI)      │
 (Postgres/Supabase)                               │
            │                  │                   │
            └───────────┬──────┘                   │
                        │                          │
                 (4) Upsert Embedding              │
                 into Vectorize index              │
                        │                          │
            ┌───────────▼──────────────┐
            │   Cloudflare Vectorize   │
            │ (stores task_id + vec)   │
            └───────────┬──────────────┘
                        │
                 (5) Query with NL
                        │
                   ┌────▼────┐
                   │ Worker  │
                   └────┬────┘
                        │
             (6) Vectorize Search → task_ids
                        │
             (7) Fetch full details from DB
                        │
                   ┌────▼─────┐
                   │   User   │
                   │  (Tasks) │
                   └──────────┘


## Flow Summary

1. User adds a task → request goes to Worker.
2. Worker saves task details in your DB (Postgres, Supabase, etc.).
3. Worker generates an embedding (Workers AI / OpenAI).
4. Worker stores embedding + task_id + optional user_id in Vectorize.
5. User queries like “my task today”.
6. Worker embeds query → searches Vectorize → gets top matching task_ids.
7. Worker queries DB with those IDs → returns full task details.