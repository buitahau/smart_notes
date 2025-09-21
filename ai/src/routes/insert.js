import { Hono } from 'hono';
import { insertNote } from '../services/insert.js';

const insertRoutes = new Hono();

insertRoutes.post('/insert', insertNote);

export default insertRoutes;
