import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import queryRoutes from './routes/query.js';
import indexRoutes from './routes/indexes.js';

const app = new Hono();
const PORT = process.env.PORT || 3000;

app.use('*', cors());
app.use('*', logger());

app.route('/api/auth', authRoutes);
app.route('/api/notes', noteRoutes);
app.route('/api/query', queryRoutes);
app.route('/api/indexes', indexRoutes);

app.get('/', c => {
  return c.json({ message: 'API is running' });
});

console.log(`Server is running on port ${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
