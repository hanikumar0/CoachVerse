import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Plus, Search, Filter, Loader2, FileText, Video, Link as LinkIcon, Archive, Download, ExternalLink, X, BookOpen, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const Materials = () => {
    const { user } = useAuthStore();
    const isTeacherOrAdmin = ['admin', 'super_admin', 'teacher'].includes(user?.role || '');
    const [materials, setMaterials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form Options
    const [courses, setCourses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fileUrl: '',
        fileType: 'PDF',
        courseId: '',
        isPublic: true
    });

    const fetchMaterials = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/materials');
            setMaterials(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
        if (isTeacherOrAdmin) {
            api.get('/courses').then(res => setCourses(res.data));
        }
    }, [isTeacherOrAdmin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/materials', formData);
            setShowModal(false);
            fetchMaterials();
            setFormData({ title: '', description: '', fileUrl: '', fileType: 'PDF', courseId: '', isPublic: true });
        } catch (err) {
            console.error(err);
            alert('Error uploading material');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        try {
            await api.delete(`/materials/${id}`);
            fetchMaterials();
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Video': return <Video className="w-6 h-6" />;
            case 'Link': return <LinkIcon className="w-6 h-6" />;
            case 'Zip': return <Archive className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Study Materials</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Resource Repository & Digital Library</p>
                </div>
                {isTeacherOrAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Resource
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for PDF, Video, or Links..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    />
                </div>
                <button className="bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <span className="text-xs uppercase tracking-widest">Sort By Type</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : materials.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="text-indigo-600 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Empty Library</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">No study materials have been uploaded for your courses yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${item.fileType === 'Video' ? 'bg-rose-50 text-rose-600' :
                                        item.fileType === 'PDF' ? 'bg-indigo-50 text-indigo-600' :
                                            item.fileType === 'Zip' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {getIcon(item.fileType)}
                                </div>
                                {isTeacherOrAdmin && (
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors truncate">
                                {item.title}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                                {item.courseId?.title || 'General Material'}
                            </p>

                            <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                    {item.fileType} • {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                                <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                                >
                                    {item.fileType === 'Link' ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Upload Material Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Upload Resource</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Resource Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Introduction to React Hooks"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Type</label>
                                        <select
                                            value={formData.fileType}
                                            onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-[10px] uppercase"
                                        >
                                            <option value="PDF">PDF Document</option>
                                            <option value="Video">Video Lesson</option>
                                            <option value="Zip">Source Code (Zip)</option>
                                            <option value="Link">External Link</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Course</label>
                                        <select
                                            required
                                            value={formData.courseId}
                                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-[10px] uppercase"
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Resource URL</label>
                                    <div className="relative">
                                        <Download className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.fileUrl}
                                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            placeholder="Paste your Drive or Dropbox link..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none font-bold text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Brief Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-xs resize-none"
                                    />
                                </div>

                                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Publish Resource</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Materials;
