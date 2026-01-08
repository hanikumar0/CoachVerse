import express from 'express';
import { getStudentDashboard, getTeacherDashboard, getParentDashboard, getAdminDashboard } from '../controllers/roleDashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
// Mobile app dashboard stats endpoint
router.get('/stats', getStudentDashboard);
router.get('/admin', authorize('admin', 'super_admin'), getAdminDashboard);
router.get('/teacher', authorize('teacher'), getTeacherDashboard);
router.get('/student', authorize('student'), getStudentDashboard);
router.get('/student-dashboard', authorize('student'), getStudentDashboard);
router.get('/teacher-dashboard', authorize('teacher'), getTeacherDashboard);
router.get('/parent', authorize('parent'), getParentDashboard);
export default router;
//# sourceMappingURL=roleDashboardRoutes.js.map