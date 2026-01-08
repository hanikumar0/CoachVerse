import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Plus, Clock, Loader2, X, BookOpen, Users, Calendar, Link as LinkIcon, Send, Eye, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const Assignments = () => {
    const { user } = useAuthStore();
    const isTeacherOrAdmin = ['admin', 'super_admin', 'teacher'].includes(user?.role || '');
    const [assignments, setAssignments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showEvaluateModal, setShowEvaluateModal] = useState(false);

    // Selection
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);

    // Form Data
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [createFormData, setCreateFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        batchId: '',
        deadline: '',
        totalPoints: '100'
    });

    const [submitFormData, setSubmitFormData] = useState({
        content: '',
        attachments: ''
    });

    const [gradeData, setGradeData] = useState({
        grade: '',
        feedback: ''
    });

    const fetchAssignments = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/assignments');
            setAssignments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [coursesRes, batchesRes] = await Promise.all([
                api.get('/courses'),
                api.get('/batches')
            ]);
            setCourses(coursesRes.data);
            setBatches(batchesRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAssignments();
        if (isTeacherOrAdmin) fetchOptions();
    }, [isTeacherOrAdmin]);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/assignments', {
                ...createFormData,
                totalPoints: Number(createFormData.totalPoints)
            });
            setShowCreateModal(false);
            fetchAssignments();
            setCreateFormData({ title: '', description: '', courseId: '', batchId: '', deadline: '', totalPoints: '100' });
        } catch (err) {
            console.error(err);
            alert('Error creating assignment');
        }
    };

    const handleSubmitAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/submissions', {
                assignmentId: selectedAssignment._id,
                content: submitFormData.content,
                attachments: submitFormData.attachments.split(',').map(s => s.trim()).filter(s => s)
            });
            setShowSubmitModal(false);
            alert('Assignment submitted successfully!');
            setSubmitFormData({ content: '', attachments: '' });
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Error submitting assignment');
        }
    };

    const handleViewSubmissions = async (asgn: any) => {
        setSelectedAssignment(asgn);
        try {
            const { data } = await api.get(`/submissions?assignmentId=${asgn._id}`);
            setSubmissions(data);
            setShowEvaluateModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGrade = async (submissionId: string) => {
        try {
            await api.patch(`/submissions/${submissionId}/grade`, {
                grade: Number(gradeData.grade),
                feedback: gradeData.feedback
            });
            setGradeData({ grade: '', feedback: '' });
            // Refresh submissions
            const { data } = await api.get(`/submissions?assignmentId=${selectedAssignment._id}`);
            setSubmissions(data);
            alert('Submission graded!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
                    <p className="text-slate-500 font-medium font-bold uppercase tracking-widest text-[10px] mt-1">
                        {isTeacherOrAdmin ? 'Academic Management Console' : 'Student Learning Portal'}
                    </p>
                </div>
                {isTeacherOrAdmin && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5" />
                        Create Assignment
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : assignments.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ClipboardList className="text-amber-600 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No assignments yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">There are no assignments posted for your institute yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {assignments.map((asgn) => (
                        <motion.div
                            key={asgn._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                                    <ClipboardList className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">{asgn.title}</h4>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${new Date() > new Date(asgn.deadline) ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {new Date() > new Date(asgn.deadline) ? 'Expired' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{asgn.courseId?.title}</span>
                                        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{asgn.batchId?.name}</span>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5" />
                                            Due: {new Date(asgn.deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:border-l md:pl-8 border-slate-50">
                                <div className="text-right mr-4 hidden md:block">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 leading-none tracking-widest">Total Value</p>
                                    <p className="text-lg font-black text-slate-900">{asgn.totalPoints} PTS</p>
                                </div>
                                {isTeacherOrAdmin ? (
                                    <button
                                        onClick={() => handleViewSubmissions(asgn)}
                                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-bold hover:bg-black transition-all uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" /> Evaluate Submissions
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setSelectedAssignment(asgn); setShowSubmitModal(true); }}
                                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" /> Submit Work
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Submit Assignment Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSubmitModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Submit Work</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedAssignment?.title}</p>
                                </div>
                                <button onClick={() => setShowSubmitModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitAssignment} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Your Content / Link</label>
                                    <textarea
                                        required
                                        value={submitFormData.content}
                                        onChange={(e) => setSubmitFormData({ ...submitFormData, content: e.target.value })}
                                        placeholder="Describe your submission or paste a Drive/Github link..."
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Attachment Links (comma separated)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={submitFormData.attachments}
                                            onChange={(e) => setSubmitFormData({ ...submitFormData, attachments: e.target.value })}
                                            placeholder="https://link1.com, https://link2.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Submit Now</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Evaluate Submissions Modal */}
            <AnimatePresence>
                {showEvaluateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEvaluateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-4xl max-h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Evaluate Work</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedAssignment?.title}</p>
                                </div>
                                <button onClick={() => setShowEvaluateModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                {submissions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Send className="text-slate-300 w-8 h-8" />
                                        </div>
                                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No submissions received yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {submissions.map((sub) => (
                                            <div key={sub._id} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                            {sub.studentId?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 leading-none">{sub.studentId?.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub.studentId?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                            {sub.status}
                                                        </span>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(sub.submittedAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 bg-white p-4 rounded-2xl border border-slate-50 mb-4 whitespace-pre-wrap">{sub.content}</p>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Score</label>
                                                        <input
                                                            type="number"
                                                            placeholder={`Out of ${selectedAssignment.totalPoints}`}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none font-bold"
                                                            onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Feedback</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Good work..."
                                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none font-bold"
                                                                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                            />
                                                            <button
                                                                onClick={() => handleGrade(sub._id)}
                                                                className="bg-indigo-600 text-white p-2 rounded-xl"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Assignment Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Post Assignment</h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Title</label>
                                    <input required type="text" value={createFormData.title} onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })} placeholder="e.g. Building a Redux Store" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Course</label>
                                        <select required value={createFormData.courseId} onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none appearance-none font-bold text-xs uppercase tracking-widest">
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Batch</label>
                                        <select required value={createFormData.batchId} onChange={(e) => setCreateFormData({ ...createFormData, batchId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none appearance-none font-bold text-xs uppercase tracking-widest">
                                            <option value="">Select Batch</option>
                                            {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Deadline</label>
                                        <input required type="date" value={createFormData.deadline} onChange={(e) => setCreateFormData({ ...createFormData, deadline: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-700 ml-1 tracking-widest">Total Points</label>
                                        <input required type="number" value={createFormData.totalPoints} onChange={(e) => setCreateFormData({ ...createFormData, totalPoints: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 uppercase text-[10px] font-black tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl">Cancel</button>
                                    <button type="submit" className="flex-[2] bg-indigo-600 text-white py-4 uppercase text-[10px] font-black tracking-widest rounded-2xl shadow-xl shadow-indigo-100">Post Now</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Assignments;
