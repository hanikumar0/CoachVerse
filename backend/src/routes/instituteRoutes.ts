import express from 'express';
import { registerInstitute, getInstitutes } from '../controllers/instituteController.js';

const router = express.Router();

router.post('/register', registerInstitute);
router.get('/', getInstitutes);

export default router;
