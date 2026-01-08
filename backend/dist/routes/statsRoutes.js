import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.get('/', authorize('admin', 'super_admin'), getStats);
export default router;
//# sourceMappingURL=statsRoutes.js.map