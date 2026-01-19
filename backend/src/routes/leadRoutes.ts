import express from 'express';
import {
    createLead,
    createPublicLead,
    getLeads,
    updateLead,
    deleteLead,
    getLeadStats
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Route
router.post('/public', createPublicLead);

// Protected Routes
router.use(protect);
router.use(authorize('admin', 'super_admin', 'staff')); // Assuming 'staff' role exists or will exist, usually admin handles this

router.route('/')
    .post(createLead)
    .get(getLeads);

router.get('/stats', getLeadStats);

router.route('/:id')
    .put(updateLead)
    .delete(deleteLead);

export default router;
