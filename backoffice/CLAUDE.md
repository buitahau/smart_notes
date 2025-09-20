## CRITICAL RULES

### Dependencies & Versions
- ALWAYS check package.json for current versions before adding/updating dependencies
- Use exact versions from package.json: Next.js 15.5.3, React 19.1.0, TypeScript 5+

### Architecture & Patterns
- This is a Next.js 15 App Router project with TypeScript
- Use Drizzle ORM with PostgreSQL for database operations
- Use Better-Auth for authentication (configured in src/lib/auth.ts)
- Use TanStack Query (@tanstack/react-query) for data fetching/mutations
- Use Chakra UI v3 for UI components
- Use Resend for email services

### Required Documentation References
- Drizzle ORM: https://orm.drizzle.team/llms-full.txt
- Better-Auth: https://www.better-auth.com/llms.txt
- Resend: https://resend.com/docs/llms.txt
- Chakra UI: Use Chakra MCP server for UI implementation

### Data Layer Rules
- ALWAYS use useMutation for data mutations (create, update, delete)
- ALWAYS use useQuery for data fetching
- Follow existing hook patterns in src/lib/hooks/
- Use proper TypeScript types from schema.ts

### File Structure Rules
- API routes: src/app/api/v1/
- Pages: src/app/(dashboard)/ for dashboard, src/app/auth/ for auth
- Components: src/components/ with proper sub-folders
- Database: src/lib/db/ (schema, connections)
- Auth: src/lib/auth.ts and src/lib/auth-client.ts
- Config: src/lib/config/ (separate backend/frontend configs)

### Code Quality
- Follow existing code patterns and conventions
- Use proper TypeScript types (exported from schema.ts)
- Maintain consistent file naming and structure
- Use centralized configuration from src/lib/config/