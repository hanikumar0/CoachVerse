import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Building2,
    GraduationCap,
    User,
    Heart,
    ArrowRight,
    BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
    {
        id: 'super_admin',
        title: 'Super Admin',
        desc: 'Platform level management and analytics.',
        icon: ShieldCheck,
        color: 'bg-slate-900',
        path: '/login/super-admin'
    },
    {
        id: 'admin',
        title: 'Institute Admin',
        desc: 'Manage your institute, staff, and students.',
        icon: Building2,
        color: 'bg-blue-600',
        path: '/login/admin'
    },
    {
        id: 'teacher',
        title: 'Teacher / Coach',
        desc: 'Create courses, manage batches, and track progress.',
        icon: GraduationCap,
        color: 'bg-emerald-600',
        path: '/login/teacher'
    },
    {
        id: 'student',
        title: 'Student',
        desc: 'Access learning materials and track your growth.',
        icon: User,
        color: 'bg-indigo-600',
        path: '/login/student'
    },
    {
        id: 'parent',
        title: 'Parent',
        desc: 'Monitor your child\'s performance and alerts.',
        icon: Heart,
        color: 'bg-rose-500',
        path: '/login/parent'
    }
];

const RoleSelectionPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-200"
                    >
                        <BookOpen className="text-white w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome to CoachVerse</h1>
                    <p className="text-slate-500 text-lg">Please select your portal to continue</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, i) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                to={role.path}
                                className="group block bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-200 transition-all text-left h-full"
                            >
                                <div className={`${role.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${role.color.split('-')[1]}-100 group-hover:scale-110 transition-transform`}>
                                    <role.icon className="text-white w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{role.desc}</p>
                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                    Access Portal
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12 text-slate-400 text-sm">
                    Need a platform demo? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Contact Support</span>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
