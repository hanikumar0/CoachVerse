import { motion } from 'framer-motion';
import { Shield, Building2, Users, HardDrive, ArrowRight, Activity } from 'lucide-react';

const SuperAdminDashboard = ({ stats }: { stats: any }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Institutes', value: '24', icon: Building2, color: 'bg-slate-900', trend: '+4' },
                    { label: 'Global Users', value: stats?.students + stats?.teachers || '0', icon: Users, color: 'bg-indigo-600', trend: '+12%' },
                    { label: 'Server Status', value: 'Healthy', icon: Activity, color: 'bg-emerald-500', trend: '99.9%' },
                    { label: 'Storage Used', value: '1.2 TB', icon: HardDrive, color: 'bg-amber-500', trend: '15%' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${item.color} p-3 rounded-2xl`}>
                                <item.icon className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{item.trend}</span>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">{item.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 font-bold">Recent System Logs</h3>
                <div className="space-y-4">
                    {[
                        { msg: 'New Institute: Global Tech Academy registered.', time: '2 mins ago', type: 'info' },
                        { msg: 'System backup completed successfully.', time: '1 hour ago', type: 'success' },
                        { msg: 'Peak traffic detected on student portal.', time: '4 hours ago', type: 'warning' },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                <p className="text-sm font-medium text-slate-700 uppercase leading-none">{log.msg}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-bold uppercase">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
