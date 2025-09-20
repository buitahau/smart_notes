import { Hono } from 'hono';
import {
  createIndex,
  createMetadataIndex,
  deleteIndex,
} from '../services/index.js';

const indexRoutes = new Hono();

indexRoutes.post('/create', createIndex);
indexRoutes.post('/create-metadata', createMetadataIndex);
indexRoutes.post('/delete', deleteIndex);

export default indexRoutes;
