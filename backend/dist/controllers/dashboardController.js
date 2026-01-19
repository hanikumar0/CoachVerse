import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';
import Exam from '../models/Exam.js';
import Material from '../models/Material.js';
import Message from '../models/Message.js';
// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        // Get assignments count
        const totalAssignments = await Assignment.countDocuments({
            assignedTo: userId
        }).catch(() => 0);
        const pendingAssignments = await Assignment.countDocuments({
            assignedTo: userId,
            status: 'pending'
        }).catch(() => 0);
        // Get attendance percentage (last 30 days)
        const attendanceRecords = await Attendance.find({
            studentId: userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).catch(() => []);
        const presentDays = attendanceRecords.filter((r) => r.status === 'present').length;
        const attendancePercentage = attendanceRecords.length > 0
            ? Math.round((presentDays / attendanceRecords.length) * 100)
            : 0;
        // Get upcoming exams count
        const upcomingExams = await Exam.countDocuments({
            date: { $gte: new Date() }
        }).catch(() => 0);
        // Get new materials count (last 7 days)
        const newMaterials = await Material.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }).catch(() => 0);
        // Get unread messages
        const unreadMessages = await Message.countDocuments({
            receiverId: userId,
            read: false
        }).catch(() => 0);
        res.json({
            totalAssignments,
            pendingAssignments,
            attendancePercentage,
            upcomingExams,
            newMaterials,
            unreadMessages
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return default values instead of error
        res.json({
            totalAssignments: 0,
            pendingAssignments: 0,
            attendancePercentage: 0,
            upcomingExams: 0,
            newMaterials: 0,
            unreadMessages: 0
        });
    }
};
// Get recent activity
export const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        // This would fetch recent activities
        // For now, return empty array
        res.json([]);
    }
    catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ message: 'Error fetching activity' });
    }
};
//# sourceMappingURL=dashboardController.js.map