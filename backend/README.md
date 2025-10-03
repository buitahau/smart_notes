# Backend - Hono API

Node.js backend with Hono framework and Drizzle ORM for database operations.

## Structure

- `src/` - Application source code
- `src/database/` - Database configuration and schema
- `src/database/migrations/` - Database migrations for Neon PostgreSQL
- `src/database/schema/` - Drizzle ORM schemas
- `src/routes/` - API route handlers
- `src/controllers/` - Business logic controllers
- `src/middleware/` - Custom middleware functions
- `src/services/` - Service layer for business logic
- `src/ai/` - AI-related functionality
- `utils/` - Utility functions and helpers

## Tech Stack

- **Framework**: Hono
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **Authentication**: Supabase Auth
- **Server**: @hono/node-server for Node.js compatibility

## Environment Setup

### Environment Variables

Add the following to your `.env` file:

```env
DATABASE_URL="your_neon_database_connection_string"
SUPABASE_URL="your_supabase_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"
PORT=3000
```

### Database Setup with Drizzle ORM

#### Running Migrations

1. **Generate migrations** (when you change the schema):
   ```bash
   npx drizzle-kit generate
   ```

2. **Run migrations**:
   ```bash
   npx drizzle-kit migrate
   ```

#### Schema Configuration

- Schema files are located in `src/database/schema/`
- Migration files are generated in `src/database/migrations/`
- Configuration is in `drizzle.config.ts`

#### Example Schema

The `notes` table schema includes:
- `id`: Primary key (text)
- `title`: Note title (required)
- `content`: Note content (required)
- `createdAt`: Creation timestamp with timezone
- `dateAt`: Update timestamp with timezone

## Development

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Token validation

### Notes
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Query
- `POST /api/query` - Query notes with AI-powered search

### Indexes
- `GET /api/indexes/create` - Create vector index
- `GET /api/indexes/create-metadata` - Create metadata index
- `POST /api/indexes/delete` - Delete index
- `GET /api/indexes/list-metadata` - List metadata indexes

## Key Features

- **Modern Framework**: Built with Hono for better performance and TypeScript support
- **Authentication**: JWT-based authentication with Supabase
- **AI Integration**: OpenRouter API integration for intelligent note querying
- **Database**: PostgreSQL with Neon cloud hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Middleware**: Custom authentication and CORS middleware
- **Logging**: Built-in request logging

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Migration from Express

This backend has been successfully migrated from Express.js to Hono framework. Key improvements:
- Better performance and smaller bundle size
- Improved TypeScript support
- Modern middleware system
- Simplified routing syntax
- Built-in CORS and logging middleware