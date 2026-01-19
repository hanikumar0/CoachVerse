import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, FileText, ChevronRight, TrendingUp } from 'lucide-react';

const TestResults = () => {
    const results: any[] = [];
    const stats = {
        average: 0,
        taken: 0,
        upcoming: 0
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Test Results</h1>
                <p className="text-slate-500 font-medium">Track your academic performance and grades.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                        <Award className="text-indigo-600 w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Average Score</p>
                    <h3 className="text-3xl font-black text-slate-900">{stats.average}%</h3>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                        <TrendingUp className="text-emerald-600 w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Tests Taken</p>
                    <h3 className="text-3xl font-black text-slate-900">{stats.taken}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="text-amber-600 w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming</p>
                    <h3 className="text-3xl font-black text-slate-900">{stats.upcoming}</h3>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Recent Assignments & Tests</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {results.length === 0 ? (
                        <div className="py-20 text-center">
                            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No test results found</p>
                        </div>
                    ) : results.map((res) => (
                        <motion.div
                            key={res.id}
                            whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
                            className="px-8 py-6 flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-tight">{res.subject}</p>
                                    <p className="text-xs text-slate-400 font-medium">Completed on {new Date(res.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900">{res.score}/{res.total}</p>
                                    <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {res.status}
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TestResults;
