import { Response } from 'express';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

export const createAssignment = async (req: any, res: Response) => {
    try {
        const { title, description, courseId, batchId, deadline, totalPoints } = req.body;

        const assignment = await Assignment.create({
            title,
            description,
            courseId,
            batchId,
            deadline,
            totalPoints,
            teacherId: req.user.id,
            instituteId: req.user.instituteId
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAssignments = async (req: any, res: Response) => {
    try {
        const query: any = { instituteId: req.user.instituteId };
        const { status } = req.query;

        // If student, only show assignments for their batch
        if (req.user.role === 'student' && req.user.batchId) {
            query.batchId = req.user.batchId;
        }

        const assignments = await Assignment.find(query)
            .populate('courseId', 'title')
            .populate('batchId', 'name')
            .populate('teacherId', 'name')
            .sort({ deadline: 1 });

        // Get submissions for these assignments by the current user
        const submissions = await Submission.find({
            studentId: req.user.id,
            assignmentId: { $in: assignments.map(a => a._id) }
        });

        const submissionMap = new Map(submissions.map(s => [s.assignmentId.toString(), s]));

        let formattedAssignments = assignments.map(a => {
            const submission = submissionMap.get(a._id.toString());
            let currentStatus = 'pending';
            if (submission) {
                currentStatus = submission.status.toLowerCase() === 'graded' ? 'graded' : 'submitted';
            }

            return {
                _id: a._id,
                title: a.title,
                subject: (a.courseId as any)?.title || 'Unknown Subject',
                description: a.description,
                dueDate: a.deadline,
                status: currentStatus,
                grade: submission?.grade,
                maxGrade: a.totalPoints,
                feedback: submission?.feedback
            };
        });

        // Filter by status if requested
        if (status && status !== 'all') {
            formattedAssignments = formattedAssignments.filter(a => a.status === status);
        }

        res.json(formattedAssignments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
