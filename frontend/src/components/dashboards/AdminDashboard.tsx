import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    Clock,
    ArrowRight,
    UserPlus,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ stats }: { stats: any }) => {
    const statItems = [
        { label: 'Total Students', value: stats?.students || 0, icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Active Courses', value: stats?.courses || 0, icon: BookOpen, color: 'bg-indigo-500', trend: '+5%' },
        { label: 'Total Teachers', value: stats?.teachers || 0, icon: GraduationCap, color: 'bg-purple-500', trend: '+2%' },
        { label: 'Active Batches', value: stats?.batches || 0, icon: TrendingUp, color: 'bg-emerald-500', trend: '+1.5%' },
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statItems.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.color} p-3 rounded-2xl shadow-lg`}>
                                <stat.icon className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 border-none leading-none uppercase mb-6">Quick Actions</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Link to="/users" className="group bg-slate-50 p-6 rounded-3xl hover:bg-slate-100 transition-colors border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">Add New User</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Student, Teacher, or Parent</p>
                                </div>
                            </Link>

                            <Link to="/courses" className="group bg-slate-50 p-6 rounded-3xl hover:bg-slate-100 transition-colors border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">Create Course</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Setup New Curriculum</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 border-none leading-none uppercase">Upcoming Live Classes</h3>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No live sessions scheduled for today</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Platform Update</h3>
                            <p className="text-indigo-100 text-sm mb-6 leading-relaxed uppercase font-medium">Multi-role support and live class integration are now active.</p>
                            <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-100">
                                Check Logs
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
