import { Request, Response } from 'express';
import User from '../models/User.js';
import Batch from '../models/Batch.js';
import mongoose from 'mongoose';
import sendEmail from '../utils/sendEmail.js';

export const createUser = async (req: any, res: Response) => {
    console.log(`[DEBUG] createUser called for: ${req.body?.email}`);
    console.log(`[DEBUG] Auth User:`, req.user ? { id: req.user._id, role: req.user.role, instituteId: req.user.instituteId } : 'MISSING');
    try {
        const { name, email, password, role, phoneNumber, children, batchId, username, gmailId, mailId } = req.body;
        console.log(`[DEBUG] Request Body (sanitized):`, { name, email, role, username, batchId });


        const query: any[] = [{ email }];
        if (username) query.push({ username });

        const userExists = await User.findOne({ $or: query });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log(`[DEBUG] Attempting User.create...`);
        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role,
            username: username || undefined,
            gmailId: gmailId || undefined,
            mailId: mailId || undefined,
            instituteId: req.user?.instituteId,
            children: role === 'parent' ? children : undefined
        });
        console.log(`[DEBUG] User created successfully:`, user._id);

        // Send Email to the user
        try {
            const loginIdentifier = username || email;
            const message = `Welcome to CoachVerse, ${name}!\n\nYour account has been created. Here are your login credentials:\n\nEmail/Username: ${loginIdentifier}\nPassword: ${password}\n\nYou can login at ${process.env.FRONTEND_URL || 'your dashboard'}\n\nBest regards,\nCoachVerse Team`;

            const html = `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4f46e5;">Welcome to CoachVerse, ${name}!</h2>
                    <p>Your account has been created. Here are your login credentials:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
                        <p style="margin: 5px 0;"><strong>Email/Username:</strong> ${loginIdentifier}</p>
                        <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                    </div>
                    <p>You can login to your dashboard to get started.</p>
                    <p style="margin-top: 30px; font-size: 0.8em; color: #6b7280;">Best regards,<br>CoachVerse Team</p>
                </div>
            `;

            await sendEmail({
                email: email,
                subject: 'Your CoachVerse Account Credentials',
                message,
                html
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // We don't return error here because the user is already created
        }

        // If batchId is provided (for students), add user to batch
        if (batchId && role === 'student') {
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
        console.error('CREATE USER ERROR:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};
