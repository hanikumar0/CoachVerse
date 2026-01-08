import Attendance from '../models/Attendance.js';
export const markAttendance = async (req, res) => {
    try {
        // Expecting an array of attendance records: [{ studentId, status, remarks }]
        const { batchId, date, records } = req.body;
        // Normalize date to start of day to avoid time conflicts
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);
        const operations = records.map((record) => ({
            updateOne: {
                filter: {
                    studentId: record.studentId,
                    batchId: batchId,
                    date: attendanceDate
                },
                update: {
                    $set: {
                        status: record.status,
                        remarks: record.remarks,
                        markedBy: req.user.id,
                        instituteId: req.user.instituteId
                    }
                },
                upsert: true
            }
        }));
        await Attendance.bulkWrite(operations);
        res.status(200).json({ message: 'Attendance marked successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAttendance = async (req, res) => {
    try {
        const { batchId, date, studentId } = req.query;
        const query = { instituteId: req.user.instituteId };
        if (batchId)
            query.batchId = batchId;
        if (studentId)
            query.studentId = studentId;
        if (date) {
            const attendanceDate = new Date(date);
            attendanceDate.setHours(0, 0, 0, 0);
            query.date = attendanceDate;
        }
        const records = await Attendance.find(query)
            .populate('studentId', 'name email')
            .populate('batchId', 'name')
            .sort({ date: -1 });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getStudentStats = async (req, res) => {
    try {
        const { studentId } = req.params;
        const totalClasses = await Attendance.countDocuments({ studentId });
        const presentClasses = await Attendance.countDocuments({ studentId, status: 'Present' });
        const percentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
        res.json({
            totalClasses,
            presentClasses,
            percentage: Math.round(percentage * 10) / 10
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user.id;
        const records = await Attendance.find({ studentId })
            .sort({ date: -1 });
        // Map backend statuses to mobile app expected statuses
        const formattedRecords = records.map(record => ({
            _id: record._id,
            date: record.date,
            status: record.status.toLowerCase() === 'present' ? 'present' :
                record.status.toLowerCase() === 'absent' ? 'absent' : 'leave',
            remarks: record.remarks
        }));
        res.json(formattedRecords);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=attendanceController.js.map