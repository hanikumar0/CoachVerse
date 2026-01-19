import { Router } from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

// GET /api/dashboard/activity
router.get('/activity', getRecentActivity);

export default router;
