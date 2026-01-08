import { motion } from 'framer-motion';
import {
    Building2,
    ArrowRight,
    UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
    {
        id: 'admin',
        title: 'Institute Owner',
        desc: 'Register and set up your institute. You can then add teachers and students from your dashboard.',
        icon: Building2,
        color: 'bg-blue-600',
        path: '/register/admin'
    }
];

const RoleSelectionRegisterPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-200"
                    >
                        <UserPlus className="text-white w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Your Account</h1>
                    <p className="text-slate-500 text-lg">Choose the account type that's right for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {roles.map((role, i) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                to={role.path}
                                className="group block bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-200 transition-all text-left h-full"
                            >
                                <div className={`${role.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${role.color.split('-')[1]}-100 group-hover:scale-110 transition-transform`}>
                                    <role.icon className="text-white w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{role.desc}</p>
                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                    Create Account
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12 text-slate-400 text-sm font-medium">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionRegisterPage;
