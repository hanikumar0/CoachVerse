import Message from '../models/Message.js';
import User from '../models/User.js';
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find all unique users who have exchanged messages with current user
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ createdAt: -1 });
        const conversationMap = new Map();
        for (const msg of messages) {
            const otherUserId = msg.senderId.toString() === userId
                ? msg.receiverId.toString()
                : msg.senderId.toString();
            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, {
                    lastMessage: msg,
                    userId: otherUserId
                });
            }
        }
        const conversations = await Promise.all(Array.from(conversationMap.values()).map(async (item) => {
            const user = await User.findById(item.userId).select('name role email');
            return {
                id: user?._id,
                name: user?.name,
                role: user?.role,
                lastMessage: item.lastMessage.content,
                time: item.lastMessage.createdAt,
                unread: !item.lastMessage.isRead && item.lastMessage.receiverId.toString() === userId ? 1 : 0
            };
        }));
        res.json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = await Message.create({
            senderId: req.user.id,
            receiverId,
            content
        });
        // In a real app, emit Socket.io event here
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=messageController.js.map