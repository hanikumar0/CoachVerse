import express from 'express';
import { submitAssignment, getSubmissions, gradeSubmission } from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('student'), submitAssignment);
router.get('/', getSubmissions);
router.patch('/:submissionId/grade', authorize('super_admin', 'admin', 'teacher'), gradeSubmission);

export default router;
