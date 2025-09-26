import express from 'express';
import noteController from '../controllers/noteController.js';
import { authenticateToken } from '../middleware/index.js';

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;
