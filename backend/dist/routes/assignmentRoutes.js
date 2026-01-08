import express from 'express';
import { createAssignment, getAssignments } from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.post('/', authorize('super_admin', 'admin', 'teacher'), createAssignment);
router.get('/', getAssignments);
export default router;
//# sourceMappingURL=assignmentRoutes.js.map