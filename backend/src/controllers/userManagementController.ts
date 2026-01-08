import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const createUser = async (req: any, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            instituteId: req.user.instituteId, // Automatically link to Admin's institute
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
