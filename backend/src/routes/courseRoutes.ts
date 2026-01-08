import express from 'express';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('super_admin', 'admin', 'teacher'), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);

export default router;
