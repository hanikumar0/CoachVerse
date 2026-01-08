import express from 'express';
import { getMyChildren } from '../controllers/parentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/children', authorize('parent'), getMyChildren);

export default router;
