import { Hono } from 'hono';
import {
  createIndex,
  createMetadataIndex,
  deleteIndex,
  listMetadataIndex,
} from '../services/indexes.js';

const indexRoutes = new Hono();

indexRoutes.get('/create', createIndex);
indexRoutes.get('/create-metadata', createMetadataIndex);
indexRoutes.post('/delete', deleteIndex);
indexRoutes.get('/list-metadata', listMetadataIndex);

export default indexRoutes;
