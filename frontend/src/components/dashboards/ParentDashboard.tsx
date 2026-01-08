import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Loader2, User, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ParentDashboard = () => {
    const [children, setChildren] = useState<any[]>([]);
    const [selectedChild, setSelectedChild] = useState<string>('');
    const [stats, setStats] = useState<any>(null);
    const [examResults, setExamResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: userData } = await api.get('/auth/me');

                if (userData.children && userData.children.length > 0) {
                    const childrenRes = await api.get('/parent/children');
                    setChildren(childrenRes.data);
                    if (childrenRes.data.length > 0) {
                        setSelectedChild(childrenRes.data[0]._id);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedChild) return;

        const fetchChildData = async () => {
            try {
                const [statsRes, resultsRes] = await Promise.all([
                    api.get(`/attendance/stats/${selectedChild}`),
                    api.get(`/exams/student/latest/${selectedChild}`)
                ]);
                setStats(statsRes.data);
                setExamResults(resultsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchChildData();
    }, [selectedChild]);

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    );

    if (children.length === 0) return (
        <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Linked Students</h3>
            <p className="text-slate-500 text-sm mt-2">Contact the admin to link your child's account.</p>
        </div>
    );

    const activeChild = children.find(c => c._id === selectedChild);

    return (
        <div className="space-y-8">
            {/* Child Switcher */}
            {children.length > 1 && (
                <div className="flex gap-4 mb-4">
                    {children.map(child => (
                        <button
                            key={child._id}
                            onClick={() => setSelectedChild(child._id)}
                            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${selectedChild === child._id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {child.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-full bg-indigo-50/30 -skew-x-12 translate-x-16 group-hover:translate-x-12 transition-transform duration-700"></div>
                <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-100 uppercase relative z-10 font-mono">
                    {activeChild?.name?.[0]}
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-slate-900 border-none leading-tight tracking-tight uppercase">Child Profile: {activeChild?.name}</h2>
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mt-1">
                        {activeChild?.email} • <span className="text-emerald-600">Active Status</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Attendance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-indigo-50 p-2 rounded-xl">
                            <Activity className="text-indigo-600 w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Attendance Rate</h3>
                    </div>
                    <div className="text-center relative">
                        <div className="inline-block p-8 rounded-full border-[8px] border-slate-50 border-t-indigo-600 border-r-indigo-600 shadow-inner">
                            <span className="text-4xl font-black text-slate-900">{stats ? stats.percentage : 0}%</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-6">{stats?.presentClasses} / {stats?.totalClasses} Classes</p>
                    </div>
                </motion.div>

                {/* Exam Results Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <Trophy className="text-emerald-600 w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Recent Exam Results</h3>
                        </div>
                        <button className="text-indigo-600 font-bold text-xs uppercase tracking-wider hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {examResults.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 font-bold text-xs uppercase">No exam results available yet.</div>
                        ) : (
                            examResults.map((result) => (
                                <div key={result._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-emerald-600 text-lg shadow-sm">
                                            {result.grade || '-'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{result.examId?.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Marks: {result.marksObtained}/{result.examId?.totalMarks}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${result.marksObtained >= (result.examId?.passingMarks || 0)
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-rose-100 text-rose-600'
                                            }`}>
                                            {result.marksObtained >= (result.examId?.passingMarks || 0) ? 'Passed' : 'Failed'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
                {/* Contact Teacher Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-rose-50 p-2 rounded-xl">
                                <Activity className="text-rose-600 w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Contact Teacher</h3>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase leading-relaxed">
                            Have questions about {activeChild?.name}'s performance?
                        </p>
                    </div>
                    <Link
                        to="/messages"
                        className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                    >
                        Open Chat
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default ParentDashboard;
