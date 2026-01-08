import express from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController.js';
import { createUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.post('/create-user', protect, authorize('admin', 'super_admin'), createUser);

export default router;
