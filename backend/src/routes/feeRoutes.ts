import express from 'express';
import {
    createFeeStructure,
    getFeeStructures,
    assignFeeToBatch,
    recordPayment,
    getAllPayments,
    getMyPayments,
    getFinancialStats
} from '../controllers/feeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Admin Routes
router.post('/structures', authorize('admin', 'super_admin'), createFeeStructure);
router.get('/structures', authorize('admin', 'super_admin'), getFeeStructures);
router.post('/assign', authorize('admin', 'super_admin'), assignFeeToBatch);
router.post('/record/:paymentId', authorize('admin', 'super_admin'), recordPayment);
router.get('/all', authorize('admin', 'super_admin'), getAllPayments);
router.get('/stats', authorize('admin', 'super_admin'), getFinancialStats);

// Shared/Role routes
router.get('/my-payments', getMyPayments);

export default router;
