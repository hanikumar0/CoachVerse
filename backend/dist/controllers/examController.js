import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';
export const createExam = async (req, res) => {
    try {
        const exam = await Exam.create({
            ...req.body,
            creatorId: req.user.id,
            instituteId: req.user.instituteId
        });
        res.status(201).json(exam);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find({ instituteId: req.user.instituteId })
            .populate('courseId', 'title')
            .populate('batchId', 'name');
        res.json(exams);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const submitExam = async (req, res) => {
    try {
        const { examId, answers } = req.body;
        const exam = await Exam.findById(examId);
        if (!exam)
            return res.status(404).json({ message: 'Exam not found' });
        let score = 0;
        let totalPossible = 0;
        exam.questions.forEach((q, idx) => {
            totalPossible += q.points;
            if (answers[idx] === q.correctAnswer) {
                score += q.points;
            }
        });
        const percentage = (score / totalPossible) * 100;
        const passed = percentage >= exam.passPercentage;
        const result = await ExamResult.create({
            examId,
            studentId: req.user.id,
            instituteId: req.user.instituteId,
            answers,
            score,
            totalPossible,
            percentage,
            passed
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getResults = async (req, res) => {
    try {
        const query = { instituteId: req.user.instituteId };
        if (req.user.role === 'student')
            query.studentId = req.user.id;
        const results = await ExamResult.find(query)
            .populate('examId', 'title')
            .populate('studentId', 'name');
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=examController.js.map