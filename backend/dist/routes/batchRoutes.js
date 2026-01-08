import express from 'express';
import { createBatch, getBatches } from '../controllers/batchController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.post('/', authorize('super_admin', 'admin'), createBatch);
router.get('/', getBatches);
export default router;
//# sourceMappingURL=batchRoutes.js.map