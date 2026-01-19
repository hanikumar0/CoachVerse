import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Calendar,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    CheckCircle2,
    X,
    FileText,
    ClipboardList,
    GraduationCap,
    FolderOpen,
    BarChart3,
    Megaphone,
    Wallet,
    Phone
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
    children: ReactNode;
}

import { useEffect } from 'react';
import api from '../../api/axios';

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = () => {
        navigate('/', { replace: true });
        setTimeout(() => logout(), 50);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications');
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            } catch (err) {
                // Silently fail for connection refused/network errors to avoid console spam
                // Only log if it's a different error
                // console.warn("Notification system unavailable");
            }
        };

        if (user) {
            fetchNotifications();
            // Poll occasionally
            const interval = setInterval(fetchNotifications, 60000); // 1 min
            return () => clearInterval(interval);
        }
    }, [user]);

    const allNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: BookOpen, label: 'Courses', path: '/courses', roles: ['super_admin', 'admin', 'teacher', 'student'] },
        { icon: Users, label: 'Batches', path: '/batches', roles: ['super_admin', 'admin', 'teacher'] },
        { icon: CheckCircle2, label: 'Attendance', path: '/attendance', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: Calendar, label: 'Timetable', path: '/timetable', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: ClipboardList, label: 'Assignments', path: '/assignments', roles: ['super_admin', 'admin', 'teacher', 'student'] },
        { icon: GraduationCap, label: 'Exams', path: '/exams', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: FolderOpen, label: 'Materials', path: '/materials', roles: ['super_admin', 'admin', 'teacher', 'student'] },
        { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: FileText, label: 'Test Results', path: '/test-results', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: Megaphone, label: 'Announcements', path: '/announcements', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { icon: Phone, label: 'CRM / Leads', path: '/leads', roles: ['super_admin', 'admin'] },
        { icon: Users, label: 'Users', path: '/users', roles: ['super_admin', 'admin'] },
        { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['super_admin', 'admin'] },
        { icon: Wallet, label: 'Fees', path: '/fees', roles: ['super_admin', 'admin', 'student', 'parent'] },
        { icon: Settings, label: 'Settings', path: '/settings', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role || ''));

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar Desktop */}
            <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 z-50 hidden lg:flex flex-col">
                <div className="p-8 h-20 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        CoachVerse
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar relative">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-white">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-8 h-20 flex items-center justify-between border-b border-slate-50">
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                    CoachVerse
                                </span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-slate-50">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen relative">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="relative max-w-md w-full hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-xl transition-all ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 max-h-[80vh] overflow-y-auto"
                                    >
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h4 className="font-bold text-slate-900">Notifications</h4>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {notifications.length === 0 ? (
                                                <p className="text-center text-slate-400 text-xs py-4">No notifications</p>
                                            ) : (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => {
                                                            navigate(n.link);
                                                            setShowNotifications(false);
                                                        }}
                                                        className={`p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group ${!n.read ? 'bg-indigo-50/30' : ''}`}
                                                    >
                                                        <p className={`text-sm font-medium ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-800'} group-hover:text-indigo-600`}>{n.text}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{new Date(n.time).toLocaleString()}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors border-t border-slate-50">
                                            View All Notifications
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 group cursor-pointer" onClick={() => navigate('/settings')}>
                            <div className="text-right flex flex-col justify-center">
                                <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{user?.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{user?.role?.replace('_', ' ')}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                {user?.name?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 relative">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
