import { Request, Response } from 'express';
import Batch from '../models/Batch.js';

export const createBatch = async (req: any, res: Response) => {
    try {
        const { name, courseId, teacherId, schedule, startDate, endDate } = req.body;
        const batch = await Batch.create({
            name,
            courseId,
            teacherId,
            schedule,
            startDate,
            endDate,
            instituteId: req.user.instituteId,
        });
        res.status(201).json(batch);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getBatches = async (req: any, res: Response) => {
    try {
        const batches = await Batch.find({ instituteId: req.user.instituteId })
            .populate('courseId teacherId students');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
