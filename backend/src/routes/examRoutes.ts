import express from 'express';
import { createExam, getExams, submitExam, getResults } from '../controllers/examController.js';
import { getStudentLatestResults } from '../controllers/examResultController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('super_admin', 'admin', 'teacher'), createExam);
router.get('/', getExams);
router.post('/submit', authorize('student'), submitExam);
router.get('/results', getResults);
router.get('/student/latest/:studentId', authorize('parent', 'admin', 'teacher'), getStudentLatestResults);

export default router;
