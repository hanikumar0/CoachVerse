import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Mail,
    Lock,
    Loader2,
    ArrowLeft,
    ShieldCheck,
    Building2,
    GraduationCap,
    User,
    Heart,
    Eye,
    EyeOff,
    Moon,
    Sun
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const roleConfigs: Record<string, any> = {
    'super-admin': {
        titleKey: 'superAdminPortal',
        role: 'super_admin',
        icon: ShieldCheck,
        color: 'bg-slate-900 dark:bg-slate-800',
        accent: 'text-slate-900 dark:text-slate-300',
        btn: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600',
        descKey: 'platformMasterAccess'
    },
    'admin': {
        titleKey: 'instituteAdmin',
        role: 'admin',
        icon: Building2,
        color: 'bg-blue-600 dark:bg-blue-700',
        accent: 'text-blue-600 dark:text-blue-400',
        btn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
        descKey: 'manageYourAcademy'
    },
    'teacher': {
        titleKey: 'teacherLogin',
        role: 'teacher',
        icon: GraduationCap,
        color: 'bg-emerald-600 dark:bg-emerald-700',
        accent: 'text-emerald-600 dark:text-emerald-400',
        btn: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600',
        descKey: 'coachDashboardAccess'
    },
    'student': {
        titleKey: 'studentPortal',
        role: 'student',
        icon: User,
        color: 'bg-indigo-600 dark:bg-indigo-700',
        accent: 'text-indigo-600 dark:text-indigo-400',
        btn: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600',
        descKey: 'accessYourLearning'
    },
    'parent': {
        titleKey: 'parentLogin',
        role: 'parent',
        icon: Heart,
        color: 'bg-rose-500 dark:bg-rose-600',
        accent: 'text-rose-500 dark:text-rose-400',
        btn: 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500',
        descKey: 'stayUpdatedOnProgress'
    }
};

const RoleLoginPage = () => {
    const { roleType } = useParams<{ roleType: string }>();
    const config = roleConfigs[roleType || 'student'] || roleConfigs.student;
    const { theme, setTheme, isDark } = useTheme();
    const { t, i18n } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });

            // Basic role validation if needed
            if (data.role !== config.role) {
                throw new Error(`Unauthorized. This portal is for ${t(config.titleKey)} only.`);
            }

            login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || t('loginFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans transition-colors">
            {/* Theme Toggle */}
            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="fixed top-8 right-8 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
            >
                {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                    <Moon className="w-5 h-5 text-slate-600" />
                )}
            </button>

            {/* Language Toggle */}
            <button
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
                className="fixed top-8 right-24 px-4 py-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300"
            >
                {i18n.language === 'en' ? '🇮🇳 हिं' : '🇬🇧 EN'}
            </button>

            <Link to="/login" className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                {t('otherPortals')}
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className={`inline-flex ${config.color} p-4 rounded-3xl mb-4 shadow-xl shadow-opacity-20`}>
                        <config.icon className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t(config.titleKey)}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t(config.descKey)}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 transition-colors">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-2xl font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">{t('emailAddress')}</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                                    placeholder={t('enterEmail')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2 ml-1">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('password')}</label>
                                <button type="button" className={`text-xs font-bold ${config.accent} hover:underline`}>{t('forgotPassword')}</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                                    placeholder={t('enterPassword')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${config.btn} text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed active:scale-95`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {t('enterPortal')}
                                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                        {t('dontHaveAccount')} <Link to="/register" className={`font-bold ${config.accent} hover:underline ml-1`}>{t('createNow')}</Link>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <BookOpen className="text-white w-4 h-4" />
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        CoachVerse
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default RoleLoginPage;
