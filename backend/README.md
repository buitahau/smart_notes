# Backend - Cloudflare Workers

Serverless backend services running on Cloudflare Workers.

## Structure

- `src/` - Worker source code
- `migrations/` - Database migrations for Cloudflare D1
- `schemas/` - Database schemas and validation
- `utils/` - Utility functions and helpers

## Services

- Authentication and authorization
- Note and task management API
- Vector database operations
- Rate limiting and security

## Development

```bash
cd backend
npm install
npm run dev
```