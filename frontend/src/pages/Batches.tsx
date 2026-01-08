import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Calendar, Clock, Loader2, ArrowRight, X, BookOpen, User as UserIcon, Check } from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

const Batches = () => {
    const { user } = useAuthStore();
    const [batches, setBatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [courses, setCourses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        courseId: '',
        teacherId: '',
        startDate: '',
        students: [] as string[]
    });

    useEffect(() => {
        fetchBatches();
        if (user?.role === 'admin' || user?.role === 'super_admin') {
            fetchFormOptions();
        }
    }, [user?.role]);

    const fetchBatches = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/batches');
            setBatches(data);
        } catch (err) {
            console.error('Failed to fetch batches', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFormOptions = async () => {
        try {
            const [coursesRes, teachersRes, studentsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/auth/users?role=teacher'),
                api.get('/auth/users?role=student')
            ]);
            setCourses(coursesRes.data);
            setTeachers(teachersRes.data);
            setAllStudents(studentsRes.data);
        } catch (err) {
            console.error('Failed to fetch form options', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/batches', {
                ...formData,
                // Add a default schedule for now as we don't have a schedule UI in the modal yet
                schedule: [{ day: 'Monday', startTime: '10:00 AM', endTime: '12:00 PM' }]
            });
            setShowModal(false);
            fetchBatches();
            setFormData({ name: '', courseId: '', teacherId: '', startDate: '', students: [] });
        } catch (err) {
            console.error('Failed to create batch', err);
            alert('Error creating batch');
        }
    };

    const toggleStudent = (id: string) => {
        setFormData(prev => ({
            ...prev,
            students: prev.students.includes(id)
                ? prev.students.filter(s => s !== id)
                : [...prev.students, id]
        }));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Batches</h1>
                    <p className="text-slate-500 font-medium">Manage student groups and class schedules.</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Batch
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : batches.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="text-emerald-600 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No active batches</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Create a batch to assign students to a course and set a timetable.</p>
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                        >
                            Setup First Batch
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {batches.map((batch, i) => (
                        <motion.div
                            key={batch._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 uppercase truncate mb-1">{batch.name}</h3>
                                    <p className="text-indigo-600 font-bold text-sm uppercase tracking-wide">
                                        {batch.courseId?.title || 'Unknown Course'}
                                    </p>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    ACTIVE
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-2xl">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                    <span>Starts on: {new Date(batch.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-2xl">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    <div>
                                        {batch.schedule?.map((item: any, idx: number) => (
                                            <div key={idx} className="text-sm">
                                                <span className="font-bold">{item.day}:</span> {item.startTime} - {item.endTime}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-2xl">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    <span>Instructor: {batch.teacherId?.name || 'TBA'}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                                    View Timetable <ArrowRight className="w-4 h-4" />
                                </button>
                                <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                    Students ({batch.students?.length || 0})
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Batch Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-bold text-slate-900">Create New Batch</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Batch Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Winter React Intensive"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Select Course</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <select
                                                required
                                                value={formData.courseId}
                                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none appearance-none"
                                            >
                                                <option value="">Choose a Course</option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Assign Teacher</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <select
                                                required
                                                value={formData.teacherId}
                                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none appearance-none"
                                            >
                                                <option value="">Choose a Teacher</option>
                                                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Start Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium outline-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Add Students ({formData.students.length})</label>
                                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                        {allStudents.map(student => (
                                            <button
                                                type="button"
                                                key={student._id}
                                                onClick={() => toggleStudent(student._id)}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${formData.students.includes(student._id)
                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                                                    }`}
                                            >
                                                <span className="text-xs font-bold truncate">{student.name}</span>
                                                {formData.students.includes(student._id) && <Check className="w-4 h-4 shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                    >
                                        Launch Batch
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Batches;
