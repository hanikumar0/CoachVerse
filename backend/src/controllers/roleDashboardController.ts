import { Response } from 'express';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';
import Material from '../models/Material.js';
import Exam from '../models/Exam.js';
import Message from '../models/Message.js';

export const getStudentDashboard = async (req: any, res: Response) => {
    try {
        const instituteId = req.user.instituteId;
        const studentId = req.user.id;

        const [totalAssignments, upcomingExams, newMaterials, unreadMessages] = await Promise.all([
            Assignment.countDocuments({ instituteId, batchId: req.user.batchId }),
            Exam.countDocuments({ instituteId, batchId: req.user.batchId, date: { $gte: new Date() } }),
            Material.countDocuments({ instituteId, $or: [{ batchId: req.user.batchId }, { batchId: null }] }),
            Message.countDocuments({ recipientId: studentId, isRead: false })
        ]);

        res.json({
            totalAssignments,
            pendingAssignments: totalAssignments, // Simplify for demo
            attendancePercentage: 85, // Placeholder
            upcomingExams,
            newMaterials,
            unreadMessages
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTeacherDashboard = async (req: any, res: Response) => {
    try {
        const instituteId = req.user.instituteId;
        const teacherId = req.user.id;

        const [totalStudents, totalBatches, totalAssignments, unreadMessages] = await Promise.all([
            User.countDocuments({ instituteId, role: 'student' }),
            Batch.countDocuments({ instituteId, teacherId }),
            Assignment.countDocuments({ instituteId, teacherId }),
            Message.countDocuments({ recipientId: teacherId, isRead: false })
        ]);

        res.json({
            totalStudents,
            totalTeachers: 0,
            totalBatches,
            unreadMessages,
            totalAssignments
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminDashboard = async (req: any, res: Response) => {
    try {
        const instituteId = req.user.instituteId;

        const [totalStudents, totalTeachers, totalBatches, unreadMessages] = await Promise.all([
            User.countDocuments({ instituteId, role: 'student' }),
            User.countDocuments({ instituteId, role: 'teacher' }),
            Batch.countDocuments({ instituteId }),
            Message.countDocuments({ recipientId: req.user.id, isRead: false })
        ]);

        res.json({
            totalStudents,
            totalTeachers,
            totalBatches,
            unreadMessages
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getParentDashboard = async (req: any, res: Response) => {
    try {
        const student = await User.findOne({ instituteId: req.user.instituteId, role: 'student' });
        res.json({
            child: student,
            performance: 88,
            attendance: 96,
            teacherNote: "John is excelling in logic building classes."
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
