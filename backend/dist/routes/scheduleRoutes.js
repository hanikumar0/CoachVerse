import express from 'express';
import { createSchedule, getSchedules, deleteSchedule, getTimetable } from '../controllers/scheduleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.post('/', authorize('super_admin', 'admin'), createSchedule);
router.get('/', getSchedules);
router.get('/timetable', getTimetable);
router.delete('/:id', authorize('super_admin', 'admin'), deleteSchedule);
export default router;
//# sourceMappingURL=scheduleRoutes.js.map