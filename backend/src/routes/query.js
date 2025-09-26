import express from 'express';
import queryController from '../controllers/queryController.js';
import { authenticateToken } from '../middleware/index.js';

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

router.post('/', queryController.query);

export default router;
