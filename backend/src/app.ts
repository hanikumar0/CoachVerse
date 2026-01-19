import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import roleDashboardRoutes from './routes/roleDashboardRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import examRoutes from './routes/examRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/dashboard', roleDashboardRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/leads', leadRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'CoachVerse API is running' });
});

// Test endpoint for mobile debugging
app.get('/api/test', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'SUCCESS',
        message: 'Mobile connection working!',
        timestamp: new Date().toISOString(),
        requestIP: req.ip
    });
});

export default app;
