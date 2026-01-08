import ExamResult from '../models/ExamResult.js';
export const getStudentLatestResults = async (req, res) => {
    try {
        const { studentId } = req.params;
        // Fetch last 5 exam results
        const results = await ExamResult.find({ studentId })
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate({
            path: 'examId',
            select: 'title totalMarks passingMarks'
        });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=examResultController.js.map