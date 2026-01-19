import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Clock, MapPin, Users, Trash2, X, Loader2, Building } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const Timetable = () => {
    const { user } = useAuthStore();
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    // Core data
    const [schedules, setSchedules] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showRoomManager, setShowRoomManager] = useState(false);

    // Form Options (Cached)
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);

    // Forms
    const [formData, setFormData] = useState({
        dayOfWeek: 'Monday',
        startTime: '',
        endTime: '',
        courseId: '',
        batchId: '',
        teacherId: '',
        roomId: '', // Selected ID
        roomNumber: '', // Fallback String (Legacy) or Just display
        meetingLink: ''
    });

    const [roomForm, setRoomForm] = useState({
        name: '',
        capacity: 30,
        resources: '' // Comma separated
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [schedulesRes, roomsRes, coursesRes, batchesRes, teachersRes] = await Promise.all([
                api.get('/schedules'),
                api.get('/rooms'),
                api.get('/courses'),
                api.get('/batches'),
                api.get('/auth/users?role=teacher')
            ]);
            setSchedules(schedulesRes.data);
            setRooms(roomsRes.data);
            setCourses(coursesRes.data);
            setBatches(batchesRes.data);
            setTeachers(teachersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/schedules', formData);
            setShowModal(false);
            const { data } = await api.get('/schedules');
            setSchedules(data);
            setFormData({ dayOfWeek: 'Monday', startTime: '', endTime: '', courseId: '', batchId: '', teacherId: '', roomId: '', roomNumber: '', meetingLink: '' });
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Error creating schedule');
        }
    };

    const handleRoomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/rooms', {
                ...roomForm,
                resources: roomForm.resources.split(',').map(s => s.trim()).filter(Boolean)
            });
            setShowRoomModal(false);
            const { data } = await api.get('/rooms');
            setRooms(data);
            setRoomForm({ name: '', capacity: 30, resources: '' });
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Error creating room');
        }
    };

    const handleDeleteSchedule = async (id: string) => {
        if (!window.confirm('Remove this class from the schedule?')) return;
        try {
            await api.delete(`/schedules/${id}`);
            const { data } = await api.get('/schedules');
            setSchedules(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteRoom = async (id: string) => {
        if (!window.confirm('Delete this room? This will not affect existing past schedules but will prevent future bookings.')) return;
        try {
            await api.delete(`/rooms/${id}`);
            setRooms(rooms.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getSchedulesForDay = (day: string) => {
        return schedules.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time Table & Rooms</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage Classes & Resources</p>
                </div>
                {isAdmin && (
                    <div className="flex gap-3 overflow-x-auto pb-2 xl:pb-0">
                        <button
                            onClick={() => setShowRoomManager(true)}
                            className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs whitespace-nowrap"
                        >
                            <Building className="w-4 h-4 text-indigo-500" />
                            Manage Rooms
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Schedule Class
                        </button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {days.map((day) => (
                        <div key={day} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{day}</h3>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getSchedulesForDay(day).length > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {getSchedulesForDay(day).length} Classes
                                </span>
                            </div>

                            <div className="space-y-3 flex-1">
                                {getSchedulesForDay(day).length === 0 ? (
                                    <div className="h-40 flex flex-col items-center justify-center text-slate-300">
                                        <Calendar className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No classes</p>
                                    </div>
                                ) : (
                                    getSchedulesForDay(day).map((schedule) => (
                                        <motion.div
                                            key={schedule._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative group"
                                        >
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteSchedule(schedule._id)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow-sm text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            <div className="flex gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                                    {schedule.startTime.replace(':', '')}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-900 text-sm truncate">{schedule.courseId?.title}</h4>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">{schedule.batchId?.name}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wide">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <Clock className="w-3 h-3 text-indigo-400" />
                                                    {schedule.startTime}-{schedule.endTime}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500 justify-end">
                                                    <Users className="w-3 h-3 text-indigo-400" />
                                                    {schedule.teacherId?.name?.split(' ')[0]}
                                                </div>
                                                {(schedule.roomId || schedule.roomNumber) && (
                                                    <div className="col-span-2 flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100">
                                                        <MapPin className="w-3 h-3" />
                                                        {schedule.roomId?.name || schedule.roomNumber}
                                                    </div>
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

            {/* Room Manager Modal */}
            <AnimatePresence>
                {showRoomManager && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoomManager(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Room Manager</h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Configure Classrooms & Labs</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowRoomModal(true)} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setShowRoomManager(false)} className="bg-white border border-slate-200 text-slate-400 p-2 rounded-xl hover:text-slate-600 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto grid md:grid-cols-2 gap-4">
                                {rooms.length === 0 ? (
                                    <div className="col-span-2 text-center py-10 text-slate-400">
                                        <Building className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="uppercase tracking-widest font-bold text-xs">No rooms configured</p>
                                    </div>
                                ) : (
                                    rooms.map(room => (
                                        <div key={room._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                                            <button onClick={() => handleDeleteRoom(room._id)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <h4 className="font-bold text-slate-900">{room.name}</h4>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Capacity: {room.capacity}</p>
                                            {room.resources && room.resources.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {room.resources.map((r: string) => (
                                                        <span key={r} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-medium"> {r} </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Room Modal (Nested) */}
            <AnimatePresence>
                {showRoomModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoomModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Add New Room</h3>
                            <form onSubmit={handleRoomSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Room Name</label>
                                    <input required type="text" placeholder="e.g. Lab 101" value={roomForm.name} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Capacity</label>
                                    <input required type="number" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Resources (Comma sep)</label>
                                    <input type="text" placeholder="Projector, Whiteboard..." value={roomForm.resources} onChange={e => setRoomForm({ ...roomForm, resources: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500 transition-colors" />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest mt-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Save Room</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Schedule Class Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Schedule Class</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"> <X className="w-6 h-6 text-slate-400" /> </button>
                            </div>
                            <form onSubmit={handleScheduleSubmit} className="p-8 space-y-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Day of Week</label>
                                    <select value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm">
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Time</label>
                                        <input required type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">End Time</label>
                                        <input required type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Course</label>
                                        <select required value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-xs uppercase">
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Batch</label>
                                        <select required value={formData.batchId} onChange={(e) => setFormData({ ...formData, batchId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-xs uppercase">
                                            <option value="">Select Batch</option>
                                            {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Teacher</label>
                                    <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm">
                                        <option value="">Select Instructor</option>
                                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Room (Required)</label>
                                        <select value={formData.roomId} onChange={(e) => setFormData({ ...formData, roomId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-sm">
                                            <option value="">Select Room</option>
                                            {rooms.map(r => <option key={r._id} value={r._id}>{r.name} (Cap: {r.capacity})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Or Link (Online)</label>
                                        <input type="text" value={formData.meetingLink} onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })} placeholder="Zoom URL" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-xs" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Confirm Schedule</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Timetable;
