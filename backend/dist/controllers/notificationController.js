import Message from '../models/Message.js';
import Announcement from '../models/Announcement.js';
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const instituteId = req.user.instituteId;
        // 1. Unread Messages
        // Find messages where receiver is current user and isRead is false
        // We can group them by sender to show "X messages from John"
        const unreadMessages = await Message.find({
            receiverId: userId,
            isRead: false
        }).populate('senderId', 'name');
        const messageNotifications = unreadMessages.map(msg => ({
            id: msg._id,
            type: 'message',
            text: `New message from ${msg.senderId.name}`,
            time: msg.createdAt,
            read: false,
            link: '/messages'
        }));
        // 2. Recent Announcements (last 7 days unread logic is complex without a tracking table, 
        // so we just show recent ones as "notifications")
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const query = {
            instituteId,
            createdAt: { $gte: sevenDaysAgo }
        };
        if (userRole !== 'admin' && userRole !== 'super_admin') {
            query.targetRoles = { $in: [userRole, 'all'] };
        }
        const recentAnnouncements = await Announcement.find(query).sort({ createdAt: -1 }).limit(5);
        const announcementNotifications = recentAnnouncements.map(ann => ({
            id: ann._id,
            type: 'announcement',
            text: `New Announcement: ${ann.title}`,
            time: ann.createdAt,
            // In a real app we'd track if user read this specific announcement
            // For now, assume announcements created in last 24h are "fresh"
            read: new Date(ann.createdAt).getTime() < (Date.now() - 24 * 60 * 60 * 1000),
            link: '/announcements'
        }));
        // Combine and sort
        const allNotifications = [...messageNotifications, ...announcementNotifications]
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        const unreadCount = allNotifications.filter(n => !n.read).length;
        res.json({
            notifications: allNotifications,
            unreadCount
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=notificationController.js.map