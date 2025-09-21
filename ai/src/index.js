import { Hono } from 'hono';
import queryRoutes from './routes/query.js';
import indexRoutes from './routes/indexes.js';
import insertRoutes from './routes/insert.js';

const app = new Hono();

app.get('/ping', c => c.json({ message: 'pong' }));

app.route('/query', queryRoutes);
app.route('/index', indexRoutes);
app.route('/note', insertRoutes);

export default app;
