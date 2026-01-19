import express from 'express';
import { createRoom, getRooms, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(authorize('admin', 'super_admin'), createRoom)
    .get(getRooms);

router.route('/:id')
    .put(authorize('admin', 'super_admin'), updateRoom)
    .delete(authorize('admin', 'super_admin'), deleteRoom);

export default router;
