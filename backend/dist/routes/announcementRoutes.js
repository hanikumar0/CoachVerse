import express from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.post('/', authorize('admin', 'super_admin', 'teacher'), createAnnouncement);
router.get('/', getAnnouncements);
router.delete('/:id', authorize('admin', 'super_admin'), deleteAnnouncement);
export default router;
//# sourceMappingURL=announcementRoutes.js.map