import { Router } from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';
const router = Router();
// All routes require authentication
router.use(authenticate);
// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);
// GET /api/dashboard/activity
router.get('/activity', getRecentActivity);
export default router;
//# sourceMappingURL=dashboardRoutes.js.map