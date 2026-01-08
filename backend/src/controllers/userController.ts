import { Request, Response } from 'express';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createUser = async (req: any, res: Response) => {
    try {
        const { name, email, password, role, phoneNumber, children, batchId } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role,
            instituteId: req.user.instituteId, // Automatically assign to admin's institute,
            children: role === 'parent' ? children : undefined
        });

        // If batchId is provided (for students), add user to batch
        if (batchId && role === 'student') {
            const Batch = mongoose.model('Batch');
            await Batch.findByIdAndUpdate(batchId, {
                $addToSet: { students: user._id }
            });
        }

        // If user is a parent and has children, link back to student
        if (role === 'parent' && children && children.length > 0) {
            await User.updateMany(
                { _id: { $in: children } },
                { $set: { parent: user._id } }
            );
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
