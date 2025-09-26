# Backend - Express.js API

Node.js backend with Express.js and Drizzle ORM for database operations.

## Structure

- `src/` - Application source code
- `src/database/` - Database configuration and schema
- `src/database/migrations/` - Database migrations for Neon PostgreSQL
- `src/database/schema/` - Drizzle ORM schemas
- `utils/` - Utility functions and helpers

## Tech Stack

- **Framework**: Express.js
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **Authentication**: Supabase Auth

## Environment Setup

### Environment Variables

Add the following to your `.env` file:

```env
DATABASE_URL="your_neon_database_connection_string"
SUPABASE_URL="your_supabase_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"
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