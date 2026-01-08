import { Response } from 'express';
import User from '../models/User.js';

export const getMyChildren = async (req: any, res: Response) => {
    try {
        const parentId = req.user.id;
        const parent = await User.findById(parentId).populate('children', 'name email role instituteId');

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        res.json(parent.children || []);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
