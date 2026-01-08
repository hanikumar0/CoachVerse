import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Institute from '../models/Institute.js';

interface AuthRequest extends Request {
    user?: any;
}

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phoneNumber, instituteName } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Only allow 'admin' registration via this public endpoint
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Registration is restricted. Contact your institute administrator.' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role: role || 'student',
        });

        if (user) {
            // If user is an admin, create an institute
            if (role === 'admin' && instituteName) {
                const institute = await Institute.create({
                    name: instituteName,
                    owner: user._id,
                });
                user.instituteId = institute._id as any;
                await user.save();
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                instituteId: user.instituteId,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const logMsg = `[${new Date().toISOString()}] Login attempt for: ${email}\n`;
        import('fs').then(fs => fs.appendFileSync('debug.log', logMsg));

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            import('fs').then(fs => fs.appendFileSync('debug.log', `[${new Date().toISOString()}] User not found for: ${email}\n`));
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        import('fs').then(fs => fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Password match for ${email}: ${isMatch}\n`));

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                instituteId: user.instituteId,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        import('fs').then(fs => fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Login ERROR for ${req.body.email}: ${(error as Error).message}\n`));
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUsers = async (req: any, res: Response) => {
    try {
        const { role } = req.query;
        const query: any = { instituteId: req.user.instituteId };
        if (role) query.role = role;

        const users = await User.find(query).select('name email role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
