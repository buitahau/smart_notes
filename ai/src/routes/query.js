import { Hono } from 'hono';
import { classifyQuery, queryTaskList, queryNotes } from '../services/query.js';

const queryRoutes = new Hono();

queryRoutes.post('/classify', classifyQuery);
queryRoutes.post('/task_list', queryTaskList);
queryRoutes.post('/', queryNotes);

export default queryRoutes;
