import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Clock, MapPin, Video, Users, BookOpen, Trash2, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const TimeTable = () => {
    const { user } = useAuthStore();
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');
    const [schedules, setSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form Options
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        dayOfWeek: 'Monday',
        startTime: '',
        endTime: '',
        courseId: '',
        batchId: '',
        teacherId: '',
        roomNumber: '',
        meetingLink: ''
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [schedulesRes, coursesRes, batchesRes, teachersRes] = await Promise.all([
                api.get('/schedules'),
                api.get('/courses'),
                api.get('/batches'),
                api.get('/auth/users?role=teacher')
            ]);
            setSchedules(schedulesRes.data);
            setCourses(coursesRes.data);
            setBatches(batchesRes.data);
            setTeachers(teachersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/schedules', formData);
            setShowModal(false);
            // Refresh schedules only
            const { data } = await api.get('/schedules');
            setSchedules(data);
            setFormData({ dayOfWeek: 'Monday', startTime: '', endTime: '', courseId: '', batchId: '', teacherId: '', roomNumber: '', meetingLink: '' });
        } catch (err) {
            console.error(err);
            alert('Error creating schedule');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remove this class from the schedule?')) return;
        try {
            await api.delete(`/schedules/${id}`);
            const { data } = await api.get('/schedules');
            setSchedules(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Group schedules by day
    const getSchedulesForDay = (day: string) => {
        return schedules.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time Table</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Weekly Class Schedule & Planner</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5" />
                        Schedule Class
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {days.map((day) => (
                        <div key={day} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{day}</h3>
                                <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {getSchedulesForDay(day).length} Classes
                                </span>
                            </div>

                            <div className="space-y-4 flex-1">
                                {getSchedulesForDay(day).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-8">
                                        <Calendar className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No classes scheduled</p>
                                    </div>
                                ) : (
                                    getSchedulesForDay(day).map((schedule) => (
                                        <motion.div
                                            key={schedule._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative group hover:shadow-md transition-all"
                                        >
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(schedule._id)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow-sm text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <div className="flex items-start gap-4 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {schedule.courseId?.title?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-0.5">{schedule.courseId?.title}</h4>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{schedule.batchId?.name}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center gap-1.5 text-slate-600 font-bold bg-white p-2 rounded-lg border border-slate-100">
                                                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                                    {schedule.startTime} - {schedule.endTime}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-600 font-bold bg-white p-2 rounded-lg border border-slate-100">
                                                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                                                    {schedule.teacherId?.name}
                                                </div>
                                                {schedule.roomNumber && (
                                                    <div className="col-span-2 flex items-center gap-1.5 text-slate-400 font-bold bg-white p-2 rounded-lg border border-slate-100 uppercase tracking-wider text-[10px]">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        Room: {schedule.roomNumber}
                                                    </div>
                                                )}
                                                {schedule.meetingLink && (
                                                    <a href={schedule.meetingLink} target="_blank" rel="noreferrer" className="col-span-2 flex items-center gap-1.5 text-indigo-600 font-bold bg-indigo-50 p-2 rounded-lg border border-indigo-100 uppercase tracking-wider text-[10px] hover:bg-indigo-100 transition-colors">
                                                        <Video className="w-3.5 h-3.5" />
                                                        Join Online Class
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Schedule Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Schedule Class</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Day of Week</label>
                                    <select
                                        value={formData.dayOfWeek}
                                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm"
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Time</label>
                                        <input
                                            required
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">End Time</label>
                                        <input
                                            required
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Course</label>
                                        <select
                                            required
                                            value={formData.courseId}
                                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-xs uppercase"
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Batch</label>
                                        <select
                                            required
                                            value={formData.batchId}
                                            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-xs uppercase"
                                        >
                                            <option value="">Select Batch</option>
                                            {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Teacher</label>
                                    <select
                                        required
                                        value={formData.teacherId}
                                        onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm"
                                    >
                                        <option value="">Select Instructor</option>
                                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Room No. (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.roomNumber}
                                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                            placeholder="101"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Meeting Link (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.meetingLink}
                                            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                            placeholder="Zoom/Meet URL"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-xs"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Add to Schedule</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default TimeTable;
