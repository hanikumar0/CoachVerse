import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Plus, Clock, Loader2, X, Play, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const Exams = () => {
    const { user } = useAuthStore();
    const isTeacherOrAdmin = ['admin', 'super_admin', 'teacher'].includes(user?.role || '');
    const [exams, setExams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTakingModal, setShowTakingModal] = useState(false);

    // Selection
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);

    // Form Options
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);

    // Create Exam Form State
    const [createFormData, setCreateFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        batchId: '',
        duration: '60',
        startTime: '',
        endTime: '',
        passPercentage: '40'
    });
    const [questions, setQuestions] = useState<any[]>([{ text: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }]);

    const fetchExams = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/exams');
            setExams(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
        if (isTeacherOrAdmin) {
            api.get('/courses').then(res => setCourses(res.data));
            api.get('/batches').then(res => setBatches(res.data));
        }
    }, [isTeacherOrAdmin]);

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/exams', {
                ...createFormData,
                duration: Number(createFormData.duration),
                passPercentage: Number(createFormData.passPercentage),
                questions
            });
            setShowCreateModal(false);
            fetchExams();
            setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }]);
        } catch (err) {
            console.error(err);
            alert('Error creating exam');
        }
    };

    const startExam = (exam: any) => {
        setSelectedExam(exam);
        setUserAnswers(new Array(exam.questions.length).fill(-1));
        setCurrentQuestionIndex(0);
        setShowTakingModal(true);
    };

    const submitExam = async () => {
        try {
            const { data } = await api.post('/exams/submit', {
                examId: selectedExam._id,
                answers: userAnswers
            });
            setShowTakingModal(false);
            alert(`Exam Submitted! Your score: ${data.score}/${data.totalPossible} (${data.percentage}%). Status: ${data.passed ? 'PASSED' : 'FAILED'}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Exams & Assessments</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                        {isTeacherOrAdmin ? 'Evaluation Engine' : 'Certification Portal'}
                    </p>
                </div>
                {isTeacherOrAdmin && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Exam
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : exams.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <GraduationCap className="text-rose-600 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No exams scheduled</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">There are currently no active or upcoming examinations.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={exam._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${new Date() < new Date(exam.startTime) ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {new Date() < new Date(exam.startTime) ? 'Scheduled' : 'Live Now'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight truncate">{exam.title}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{exam.courseId?.title}</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{exam.duration} Minutes</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <FileText className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{exam.questions.length} Questions</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{new Date(exam.startTime).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => isTeacherOrAdmin ? null : startExam(exam)}
                                className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isTeacherOrAdmin ? 'bg-slate-50 text-slate-400 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                                    }`}
                            >
                                {isTeacherOrAdmin ? 'Manage Exam' : <><Play className="w-3 h-3" /> Start Examination</>}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Exam Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Construct New Exam</h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>
                            <form onSubmit={handleCreateExam} className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Exam Header</label>
                                            <input required type="text" value={createFormData.title} onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })} placeholder="Final Term Examination" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Course</label>
                                                <select required value={createFormData.courseId} onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-[10px] uppercase tracking-wider">
                                                    <option value="">Select</option>
                                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Batch</label>
                                                <select required value={createFormData.batchId} onChange={(e) => setCreateFormData({ ...createFormData, batchId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-[10px] uppercase tracking-wider">
                                                    <option value="">Select</option>
                                                    {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Starts At</label>
                                                <input required type="datetime-local" value={createFormData.startTime} onChange={(e) => setCreateFormData({ ...createFormData, startTime: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-[10px]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ends At</label>
                                                <input required type="datetime-local" value={createFormData.endTime} onChange={(e) => setCreateFormData({ ...createFormData, endTime: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-[10px]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Duration (Min)</label>
                                                <input required type="number" value={createFormData.duration} onChange={(e) => setCreateFormData({ ...createFormData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Passing %</label>
                                                <input required type="number" value={createFormData.passPercentage} onChange={(e) => setCreateFormData({ ...createFormData, passPercentage: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Questions Selection</h3>
                                        <button
                                            type="button"
                                            onClick={() => setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }])}
                                            className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                                        >
                                            + Add Field
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {questions.map((q, idx) => (
                                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                                <div className="flex gap-4">
                                                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</span>
                                                    <input required type="text" value={q.text} onChange={(e) => {
                                                        const newQ = [...questions];
                                                        newQ[idx].text = e.target.value;
                                                        setQuestions(newQ);
                                                    }} placeholder="Question text..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none font-bold" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {q.options.map((opt: string, oidx: number) => (
                                                        <div key={oidx} className="flex gap-2 items-center">
                                                            <input type="radio" checked={q.correctAnswer === oidx} onChange={() => {
                                                                const newQ = [...questions];
                                                                newQ[idx].correctAnswer = oidx;
                                                                setQuestions(newQ);
                                                            }} className="accent-indigo-600" />
                                                            <input required type="text" value={opt} onChange={(e) => {
                                                                const newQ = [...questions];
                                                                newQ[idx].options[oidx] = e.target.value;
                                                                setQuestions(newQ);
                                                            }} placeholder={`Option ${oidx + 1}`} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-100 mt-8">Finalize and Deploy Exam</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Taking Exam Modal */}
            <AnimatePresence>
                {showTakingModal && selectedExam && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
                            <div className="p-10 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedExam.title}</h2>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2">{selectedExam.courseId?.title}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-rose-600 font-black text-xl leading-none mb-1">
                                        <Clock className="w-5 h-5" /> 00:{selectedExam.duration}:00
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Remaining</span>
                                </div>
                            </div>

                            <div className="p-10 flex-1">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {selectedExam.questions.length}</span>
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / selectedExam.questions.length) * 100}%` }}></div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-10 leading-tight">{selectedExam.questions[currentQuestionIndex].text}</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {selectedExam.questions[currentQuestionIndex].options.map((opt: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const newAns = [...userAnswers];
                                                newAns[currentQuestionIndex] = idx;
                                                setUserAnswers(newAns);
                                            }}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all group ${userAnswers[currentQuestionIndex] === idx
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${userAnswers[currentQuestionIndex] === idx ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:bg-slate-100'
                                                    }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span className="font-bold">{opt}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                {currentQuestionIndex === selectedExam.questions.length - 1 ? (
                                    <button
                                        onClick={submitExam}
                                        className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100"
                                    >
                                        Finish & Submit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                        className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Exams;
