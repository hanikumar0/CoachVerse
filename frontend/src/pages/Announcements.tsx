import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Megaphone, Bell, Trash2, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Announcements = () => {
    const { user } = useAuthStore();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [targetRoles, setTargetRoles] = useState<string[]>(['all']);
    const [type, setType] = useState('info');

    const canCreate = ['admin', 'super_admin', 'teacher'].includes(user?.role || '');
    const canDelete = ['admin', 'super_admin'].includes(user?.role || '');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/announcements');
            setAnnouncements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/announcements', {
                title,
                content,
                targetRoles,
                type
            });
            setShowCreate(false);
            setTitle('');
            setContent('');
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Announcements</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Updates & Alerts</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-wider text-xs"
                    >
                        <Megaphone className="w-4 h-4" />
                        New Announcement
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-8"
                    >
                        <form onSubmit={handleCreate} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <input
                                type="text"
                                placeholder="Details Headline"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400"
                                required
                            />
                            <textarea
                                placeholder="Message Content"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 min-h-[100px] placeholder:text-slate-400"
                                required
                            />
                            <div className="flex gap-4">
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-xs uppercase text-slate-600 outline-none"
                                >
                                    <option value="info">Info</option>
                                    <option value="alert">Alert</option>
                                    <option value="event">Event</option>
                                </select>
                                <select
                                    value={targetRoles[0]}
                                    onChange={e => setTargetRoles([e.target.value])}
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-xs uppercase text-slate-600 outline-none"
                                >
                                    <option value="all">Check All</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="parent">Parent</option>
                                </select>
                                <button type="submit" className="ml-auto bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800">
                                    <Send className="w-3 h-3" /> Post
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
            ) : (
                <div className="grid gap-4">
                    {announcements.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
                            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-slate-900 font-bold">No Announcements</h3>
                            <p className="text-slate-400 text-sm mt-1">Check back later for updates.</p>
                        </div>
                    ) : (
                        announcements.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow ${item.type === 'alert' ? 'border-l-4 border-l-rose-500' :
                                        item.type === 'event' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-indigo-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${item.type === 'alert' ? 'bg-rose-50 text-rose-600' :
                                                item.type === 'event' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm font-medium">{item.content}</p>
                                <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                    <span>Posted by {item.author?.name} ({item.author?.role})</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default Announcements;
