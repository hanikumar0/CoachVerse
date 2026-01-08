import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const TeacherDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/dashboard/teacher');
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'My Students', value: data?.totalStudents, icon: Users, color: 'bg-emerald-600' },
                    { label: 'Active Batches', value: data?.batches?.length, icon: Calendar, color: 'bg-blue-600' },
                    { label: 'Total Hours', value: data?.hoursTaught, icon: Clock, color: 'bg-indigo-600' },
                    { label: 'Assignments', value: data?.assignments, icon: CheckCircle, color: 'bg-rose-500' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                    >
                        <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                            <item.icon className="text-white w-6 h-6" />
                        </div>
                        <p className="text-slate-500 text-sm font-semibold uppercase">{item.label}</p>
                        <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-slate-900 border-none leading-none uppercase">Assigned Batches</h3>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="space-y-4">
                    {data?.batches?.length === 0 ? (
                        <p className="text-center py-10 text-slate-400 font-bold uppercase tracking-wider">No batches assigned yet.</p>
                    ) : data?.batches?.map((batch: any, i: number) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group">
                            <div className="flex items-center gap-6">
                                <div className="text-center min-w-[100px] bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                                    <p className="text-xs font-black text-slate-400 uppercase leading-tight mb-1">Starts</p>
                                    <p className="text-sm font-black text-indigo-600 uppercase leading-none">{batch.schedule?.[0]?.startTime || 'TBD'}</p>
                                </div>
                                <div className="w-[1px] h-12 bg-slate-200 hidden md:block"></div>
                                <div>
                                    <p className="text-xs font-bold text-emerald-600 uppercase mb-1 tracking-wider">{batch.courseId?.title}</p>
                                    <p className="text-lg font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors uppercase">{batch.name}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex gap-3">
                                <button className="bg-white text-slate-600 border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                                    View Students
                                </button>
                                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                    Start Class
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
