import express from 'express';
import { createMaterial, getMaterials, deleteMaterial } from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('super_admin', 'admin', 'teacher'), createMaterial);
router.get('/', getMaterials);
router.delete('/:id', authorize('super_admin', 'admin', 'teacher'), deleteMaterial);

export default router;
