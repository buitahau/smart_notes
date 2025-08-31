const express = require('express');
const noteController = require('../controllers/noteController');
const { authenticateToken } = require('../middleware');

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;