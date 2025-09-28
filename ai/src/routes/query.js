import { Hono } from 'hono';
import { classifyQuery } from '../services/query/query.js';
import { queryTaskList } from '../services/query/queryTaskList.js';
import { queryDateLookup } from '../services/query/queryDateLookup.js';

const queryRoutes = new Hono();

queryRoutes.post('/classify', classifyQuery);
queryRoutes.post('/task_list', queryTaskList);
queryRoutes.post('/date_lookup', queryDateLookup);

export default queryRoutes;
