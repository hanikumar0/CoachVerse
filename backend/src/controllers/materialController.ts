import { Response } from 'express';
import Material from '../models/Material.js';

export const createMaterial = async (req: any, res: Response) => {
    try {
        const material = await Material.create({
            ...req.body,
            uploaderId: req.user.id,
            instituteId: req.user.instituteId
        });
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMaterials = async (req: any, res: Response) => {
    try {
        const { courseId, batchId } = req.query;
        const query: any = { instituteId: req.user.instituteId };

        if (courseId) query.courseId = courseId;
        if (batchId) query.batchId = batchId;

        const materials = await Material.find(query)
            .populate('courseId', 'title')
            .populate('uploaderId', 'name')
            .sort({ createdAt: -1 });

        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteMaterial = async (req: any, res: Response) => {
    try {
        const material = await Material.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.user.instituteId
        });

        if (!material) return res.status(404).json({ message: 'Material not found' });

        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
