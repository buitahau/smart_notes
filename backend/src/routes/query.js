const express = require('express');
const queryController = require('../controllers/queryController');
const { authenticateToken } = require('../middleware');

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

router.post('/', queryController.query);

module.exports = router;