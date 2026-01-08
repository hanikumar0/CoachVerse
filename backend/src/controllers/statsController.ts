import { Response } from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import Institute from '../models/Institute.js';

export const getStats = async (req: any, res: Response) => {
    try {
        const instituteId = req.user.instituteId;

        const [students, teachers, courses, batches] = await Promise.all([
            User.countDocuments({ instituteId, role: 'student' }),
            User.countDocuments({ instituteId, role: 'teacher' }),
            Course.countDocuments({ instituteId }),
            Batch.countDocuments({ instituteId })
        ]);

        res.json({
            students,
            teachers,
            courses,
            batches
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
