import { Hono } from 'hono';
import authController from '../controllers/authController.js';

const router = new Hono();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/validate', authController.validateToken);

export default router;
