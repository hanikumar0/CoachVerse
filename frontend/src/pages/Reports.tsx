import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, BookOpen, Download } from 'lucide-react';

const Reports = () => {
    const stats = [
        { label: 'Total Revenue', value: '$0', growth: '0%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Active Students', value: '0', growth: '0%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Courses Sold', value: '0', growth: '0%', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
                    <p className="text-slate-500 font-medium">Detailed insights into your institute's performance and growth.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-sm">
                    <Download className="w-5 h-5" />
                    Export Global Report
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-10">
                {stats.map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
                    >
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                            <item.icon className="w-7 h-7" />
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 leading-none">{item.value}</h3>
                            </div>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full leading-none mb-1">
                                {item.growth}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-96 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <BarChart3 className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 uppercase">Growth Chart Placeholder</h4>
                    <p className="text-slate-400 max-w-xs mx-auto mt-2">Visualizing student enrollment and revenue growth over the past 6 months.</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-900 uppercase mb-8 border-none leading-none">Top Performing Courses</h4>
                    <div className="space-y-6">
                        <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No sales data available yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Reports;
