import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

// Role Dashboards
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import TeacherDashboard from '../components/dashboards/TeacherDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import ParentDashboard from '../components/dashboards/ParentDashboard';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Stats are only relevant for Admins/Super Admins in this demo
                if (user?.role === 'admin' || user?.role === 'super_admin') {
                    const { data } = await api.get('/stats');
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [user?.role]);

    const renderDashboard = () => {
        switch (user?.role) {
            case 'super_admin':
                return <SuperAdminDashboard stats={stats} />;
            case 'admin':
                return <AdminDashboard stats={stats} />;
            case 'teacher':
                return <TeacherDashboard />;
            case 'student':
                return <StudentDashboard />;
            case 'parent':
                return <ParentDashboard />;
            default:
                return <div className="p-8 text-slate-500 font-bold uppercase">Generic Dashboard Profile</div>;
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 border-none leading-none">Welcome back, {user?.name}! 👋</h1>
                <p className="text-slate-500 mt-2 font-medium tracking-wide">
                    {user?.role === 'super_admin' ? 'Monitoring Global Platform Health' :
                        user?.role === 'admin' ? "Here's what's happening in your institute today." :
                            user?.role === 'teacher' ? 'Your teaching schedule and student progress.' :
                                user?.role === 'student' ? 'Pick up where you left off.' :
                                    'Monitoring your child\'s learning progress.'}
                </p>
            </div>

            {isLoading && (user?.role === 'admin' || user?.role === 'super_admin') ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                renderDashboard()
            )}
        </DashboardLayout>
    );
};

export default Dashboard;
