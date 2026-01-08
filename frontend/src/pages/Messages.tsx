import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Send, Search, MoreVertical, Phone, Video, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Messages = () => {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // State for interval polling
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await api.get('/messages/conversations');
                setConversations(data);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            }
        };
        fetchConversations();

        // Poll for new conversations every 10 seconds
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [refreshTrigger]);

    // Fetch Messages Active Chat
    useEffect(() => {
        if (!activeChat) return;

        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/messages/${activeChat}`);
                const formatted = data.map((m: any) => ({
                    id: m._id,
                    text: m.content,
                    senderId: m.senderId,
                    timestamp: new Date(m.createdAt)
                }));
                setMessages(formatted);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();

        // Poll for new messages details every 3 seconds if chat is active
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);

    }, [activeChat]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            await api.post('/messages', {
                receiverId: activeChat,
                content: newMessage
            });

            // Optimistic update
            setMessages(prev => [...prev, {
                id: Date.now().toString(), // temp ID
                text: newMessage,
                senderId: user?._id,
                timestamp: new Date()
            }]);

            setNewMessage('');
            setRefreshTrigger(p => p + 1); // Trigger conversation list update to show latest message
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] rounded-[2.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden flex">

                {/* Sidebar - Chat List */}
                <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                className={`w-full p-4 flex items-center gap-4 hover:bg-white transition-all border-b border-slate-50 ${activeChat === chat.id ? 'bg-white shadow-sm border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        {chat.name[0]}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{chat.name}</h4>
                                        <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                {activeChat ? (
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Chat Header */}
                        <div className="h-20 border-b border-slate-50 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                    {conversations.find(c => c.id === activeChat)?.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{conversations.find(c => c.id === activeChat)?.name}</h3>
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><Phone className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><Video className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium shadow-sm ${msg.senderId === user?._id
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-50">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-medium text-slate-700"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 text-slate-400">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <User className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Chat Selected</h3>
                        <p className="text-sm">Choose a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Messages;
