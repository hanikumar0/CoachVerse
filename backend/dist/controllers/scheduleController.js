import Schedule from '../models/Schedule.js';
export const createSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.create({
            ...req.body,
            instituteId: req.user.instituteId
        });
        res.status(201).json(schedule);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSchedules = async (req, res) => {
    try {
        const { batchId, teacherId } = req.query;
        const query = { instituteId: req.user.instituteId };
        if (batchId)
            query.batchId = batchId;
        if (teacherId)
            query.teacherId = teacherId;
        const schedules = await Schedule.find(query)
            .populate('batchId', 'name')
            .populate('courseId', 'title')
            .populate('teacherId', 'name')
            .sort({ dayOfWeek: 1, startTime: 1 });
        res.json(schedules);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getTimetable = async (req, res) => {
    try {
        // Find schedules for the user's institute
        // If the user is a student, we should probably filter by their batch
        // For now, let's get all schedules for the institute
        const query = { instituteId: req.user.instituteId };
        // If student, filter by batch
        if (req.user.role === 'student' && req.user.batchId) {
            query.batchId = req.user.batchId;
        }
        else if (req.user.role === 'teacher') {
            query.teacherId = req.user._id;
        }
        const schedules = await Schedule.find(query)
            .populate('courseId', 'title')
            .populate('teacherId', 'name')
            .populate('batchId', 'name');
        const dayMap = {
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6,
            'Sunday': 0
        };
        const formattedSchedule = {
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
        };
        schedules.forEach(s => {
            const dayNum = dayMap[s.dayOfWeek];
            formattedSchedule[dayNum].push({
                _id: s._id,
                subject: s.courseId?.title || 'Unknown Subject',
                teacher: s.teacherId?.name || 'Unknown Teacher',
                room: s.roomNumber || 'N/A',
                startTime: s.startTime,
                endTime: s.endTime,
                day: s.dayOfWeek
            });
        });
        res.json(formattedSchedule);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.user.instituteId
        });
        if (!schedule)
            return res.status(404).json({ message: 'Schedule entry not found' });
        res.json({ message: 'Schedule entry deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=scheduleController.js.map