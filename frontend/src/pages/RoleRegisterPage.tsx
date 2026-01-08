import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    User,
    Building2,
    GraduationCap,
    Heart,
    Loader2,
    ArrowLeft,
    Phone,
    ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const roleConfigs: Record<string, any> = {
    'admin': {
        title: 'Institute Owner Registration',
        role: 'admin',
        icon: Building2,
        color: 'bg-blue-600',
        accent: 'text-blue-600',
        btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100',
        desc: 'Set up your teaching empire'
    },
    'teacher': {
        title: 'Teacher Onboarding',
        role: 'teacher',
        icon: GraduationCap,
        color: 'bg-emerald-600',
        accent: 'text-emerald-600',
        btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100',
        desc: 'Connect with students and institutes'
    },
    'student': {
        title: 'Student Registration',
        role: 'student',
        icon: User,
        color: 'bg-indigo-600',
        accent: 'text-indigo-600',
        btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100',
        desc: 'Start your learning journey'
    },
    'parent': {
        title: 'Parent Registration',
        role: 'parent',
        icon: Heart,
        color: 'bg-rose-500',
        accent: 'text-rose-500',
        btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-100',
        desc: 'Support your child\'s education'
    }
};

const RoleRegisterPage = () => {
    const { roleType } = useParams<{ roleType: string }>();
    const config = roleConfigs[roleType || 'student'] || roleConfigs.student;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        instituteName: '', // For Admin
        role: config.role
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', formData);
            login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 font-sans">
            <Link to="/register" className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Choose Again
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full"
            >
                <div className="text-center mb-8">
                    <div className={`inline-flex ${config.color} p-4 rounded-3xl mb-4 shadow-xl`}>
                        <config.icon className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">{config.title}</h2>
                    <p className="text-slate-500 mt-2 font-medium">{config.desc}</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                        placeholder="+91 99887766"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {config.role === 'admin' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Institute Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="instituteName"
                                        value={formData.instituteName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                        placeholder="Elite Academy"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${config.btn} text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Register as {config.role.replace('_', ' ')}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-400 text-sm font-medium">
                        Already have an account? <Link to="/login" className={`font-bold ${config.accent} hover:underline ml-1`}>Sign In</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RoleRegisterPage;
