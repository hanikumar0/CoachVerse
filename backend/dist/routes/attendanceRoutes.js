import express from 'express';
import { markAttendance, getAttendance, getStudentStats, getMyAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.post('/', authorize('admin', 'super_admin', 'teacher'), markAttendance);
router.get('/', getAttendance);
router.get('/my-attendance', getMyAttendance);
router.get('/stats/:studentId', getStudentStats);
export default router;
//# sourceMappingURL=attendanceRoutes.js.map