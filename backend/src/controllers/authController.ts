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
        const { name, email, password, role, phoneNumber, instituteName, username, gmailId, mailId } = req.body;

        const query: any[] = [{ email }];
        if (username) query.push({ username });

        const userExists = await User.findOne({ $or: query });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Only allow 'admin' and 'mail_user' registration via this public endpoint
        if (role !== 'admin' && role !== 'mail_user') {
            return res.status(403).json({ message: 'Registration is restricted. Contact your institute administrator.' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            username: username || undefined,
            gmailId: gmailId || undefined,
            mailId: mailId || undefined,
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
                username: user.username,
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
        const { email, username, password } = req.body;
        const identifier = email || username;

        const logMsg = `[${new Date().toISOString()}] Login attempt for: ${identifier}\n`;
        import('fs').then(fs => fs.appendFileSync('debug.log', logMsg));

        if (!identifier) {
            return res.status(400).json({ message: 'Email or Username is required' });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        }).select('+password');

        if (!user) {
            import('fs').then(fs => fs.appendFileSync('debug.log', `[${new Date().toISOString()}] User not found for: ${email || username}\n`));
            return res.status(401).json({ message: 'Invalid email/username or password' });
        }

        const isMatch = await user.comparePassword(password);
        import('fs').then(fs => fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Password match for ${email || username}: ${isMatch}\n`));

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
                instituteId: user.instituteId,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email/username or password' });
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

        const users = await User.find(query).select('name email role username gmailId mailId phoneNumber');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const resendCredentials = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a new temporary password
        const newPassword = Math.random().toString(36).slice(-8);
        user.password = newPassword;
        await user.save();

        // Send Email
        const sendEmail = (await import('../utils/sendEmail.js')).default;
        const loginIdentifier = user.username || user.email;
        const message = `Hello ${user.name},\n\nYour account credentials have been reset. Here are your new login details:\n\nEmail/Username: ${loginIdentifier}\nPassword: ${newPassword}\n\nPlease login and change your password.\n\nBest regards,\nCoachVerse Team`;

        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">Account Recovery, ${user.name}</h2>
                <p>Your account credentials have been reset. Here are your new login details:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Email/Username:</strong> ${loginIdentifier}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${newPassword}</p>
                </div>
                <p>Please login and change your password as soon as possible.</p>
                <p style="margin-top: 30px; font-size: 0.8em; color: #6b7280;">Best regards,<br>CoachVerse Team</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Your CoachVerse New Credentials',
            message,
            html
        });

        res.json({ message: 'Credentials resent successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteUser = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
