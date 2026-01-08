import { Response } from 'express';
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';

export const submitAssignment = async (req: any, res: Response) => {
    try {
        const { assignmentId, content, attachments } = req.body;

        // Check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({ assignmentId, studentId: req.user.id });
        if (existingSubmission) {
            return res.status(400).json({ message: 'You have already submitted this assignment' });
        }

        const submission = await Submission.create({
            assignmentId,
            studentId: req.user.id,
            instituteId: req.user.instituteId,
            content,
            attachments,
            status: new Date() > new Date(assignment.deadline) ? 'Late' : 'Submitted'
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getSubmissions = async (req: any, res: Response) => {
    try {
        const { assignmentId } = req.query;
        const query: any = { instituteId: req.user.instituteId };

        if (assignmentId) query.assignmentId = assignmentId;

        // Students only see their own submissions
        if (req.user.role === 'student') {
            query.studentId = req.user.id;
        }

        const submissions = await Submission.find(query)
            .populate('studentId', 'name email')
            .populate('assignmentId', 'title');

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const gradeSubmission = async (req: any, res: Response) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;

        const submission = await Submission.findOneAndUpdate(
            { _id: submissionId, instituteId: req.user.instituteId },
            { grade, feedback, status: 'Graded' },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
