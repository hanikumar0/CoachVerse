import Announcement from '../models/Announcement.js';
export const createAnnouncement = async (req, res) => {
    try {
        const { title, content, targetRoles, type } = req.body;
        const announcement = await Announcement.create({
            title,
            content,
            targetRoles,
            type,
            author: req.user.id,
            instituteId: req.user.instituteId
        });
        res.status(201).json(announcement);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAnnouncements = async (req, res) => {
    try {
        const userRole = req.user.role;
        const query = { instituteId: req.user.instituteId };
        // If not admin, filter by target roles
        if (userRole !== 'admin' && userRole !== 'super_admin') {
            query.targetRoles = { $in: [userRole, 'all'] };
        }
        const announcements = await Announcement.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name role');
        res.json(announcements);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteAnnouncement = async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=announcementController.js.map