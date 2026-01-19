import express from 'express';
import { register, login, getMe, getUsers, resendCredentials, deleteUser } from '../controllers/authController.js';
import { createUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.post('/create-user', protect, authorize('admin', 'super_admin'), createUser);
router.post('/resend-credentials/:id', protect, authorize('admin', 'super_admin'), resendCredentials);
router.delete('/users/:id', protect, authorize('admin', 'super_admin'), deleteUser);

export default router;
