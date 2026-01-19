import { Response } from 'express';
import Schedule from '../models/Schedule.js';

// Helper to check time intersection
const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    return (start1 < end2 && end1 > start2);
};

export const createSchedule = async (req: any, res: Response) => {
    try {
        const { dayOfWeek, startTime, endTime, teacherId, roomId, instituteId } = req.body;
        const targetInstituteId = req.user.instituteId; // Enforce security

        // 1. Check Teacher Conflict
        const teacherConflict = await Schedule.findOne({
            instituteId: targetInstituteId,
            teacherId,
            dayOfWeek,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ]
        });

        if (teacherConflict) {
            return res.status(409).json({
                message: `Teacher collision! Pass overlap: ${teacherConflict.startTime}-${teacherConflict.endTime}`
            });
        }

        // 2. Check Room Conflict (if room is assigned)
        if (roomId) {
            const roomConflict = await Schedule.findOne({
                instituteId: targetInstituteId,
                roomId,
                dayOfWeek,
                $or: [
                    { startTime: { $lt: endTime, $gte: startTime } },
                    { endTime: { $gt: startTime, $lte: endTime } },
                    { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
                ]
            });

            if (roomConflict) {
                return res.status(409).json({
                    message: `Room collision! Already booked: ${roomConflict.startTime}-${roomConflict.endTime}`
                });
            }
        }

        const schedule = await Schedule.create({
            ...req.body,
            instituteId: targetInstituteId
        });

        // Populate specific fields immediately for frontend if needed, or return raw
        const populated = await schedule.populate(['roomId', 'teacherId', 'courseId', 'batchId']);

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getSchedules = async (req: any, res: Response) => {
    try {
        const { batchId, teacherId } = req.query;
        const query: any = { instituteId: req.user.instituteId };

        if (batchId) query.batchId = batchId;
        if (teacherId) query.teacherId = teacherId;

        const schedules = await Schedule.find(query)
            .populate('batchId', 'name')
            .populate('courseId', 'title')
            .populate('teacherId', 'name')
            .populate('roomId', 'name') // Populate Room info
            .sort({ dayOfWeek: 1, startTime: 1 });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getTimetable = async (req: any, res: Response) => {
    try {
        const query: any = { instituteId: req.user.instituteId };

        if (req.user.role === 'student' && req.user.batchId) {
            query.batchId = req.user.batchId;
        } else if (req.user.role === 'teacher') {
            query.teacherId = req.user._id;
        }

        const schedules = await Schedule.find(query)
            .populate('courseId', 'title')
            .populate('teacherId', 'name')
            .populate('batchId', 'name')
            .populate('roomId', 'name');

        const dayMap: { [key: string]: number } = {
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6,
            'Sunday': 0
        };

        const formattedSchedule: { [key: number]: any[] } = {
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
        };

        schedules.forEach(s => {
            const dayNum = dayMap[s.dayOfWeek];
            formattedSchedule[dayNum].push({
                _id: s._id,
                subject: (s.courseId as any)?.title || 'Unknown Subject',
                teacher: (s.teacherId as any)?.name || 'Unknown Teacher',
                room: (s.roomId as any)?.name || s.roomNumber || 'N/A', // Try roomId name first, then formatted fallback
                startTime: s.startTime,
                endTime: s.endTime,
                day: s.dayOfWeek
            });
        });

        res.json(formattedSchedule);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteSchedule = async (req: any, res: Response) => {
    try {
        const schedule = await Schedule.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.user.instituteId
        });

        if (!schedule) return res.status(404).json({ message: 'Schedule entry not found' });

        res.json({ message: 'Schedule entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
