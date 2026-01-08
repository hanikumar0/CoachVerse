import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Star, PlayCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const StudentDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/dashboard/student');
                setData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Completed Lessons', value: `${data?.completedLessons}/${data?.totalLessons}`, icon: BookOpen, color: 'bg-indigo-600' },
                    { label: 'Attendance', value: `${data?.attendance}%`, icon: Clock, color: 'bg-emerald-600' },
                    { label: 'Points Earned', value: data?.points, icon: Award, color: 'bg-amber-500' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6"
                    >
                        <div className={`${item.color} p-4 rounded-2xl shadow-lg`}>
                            <item.icon className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-semibold uppercase">{item.label}</p>
                            <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{item.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 border-none leading-none">Your Enrolled Courses</h3>
                        <div className="space-y-4">
                            {data?.enrolledCourses?.map((c: any, i: number) => (
                                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{c.tags?.[0] || 'Learning'}</p>
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase leading-none truncate">{c.title}</h4>
                                        </div>
                                        <PlayCircle className="text-slate-300 group-hover:text-indigo-600 transition-colors w-10 h-10 shrink-0" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Course Progress</span>
                                            <span>45%</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `45%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                        <Star className="text-yellow-400 w-10 h-10 mb-4 fill-yellow-400 relative z-10" />
                        <h3 className="text-xl font-bold mb-2 relative z-10">Exam Tomorrow!</h3>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed relative z-10">System Design & Scalability Quiz starting at 10:00 AM.</p>
                        <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors relative z-10">
                            View Syllabus
                        </button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
