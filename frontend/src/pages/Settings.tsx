import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { User, Shield, Bell, Globe, Save } from 'lucide-react';

const Settings = () => {
    const { user } = useAuthStore();

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 font-medium">Manage your account and institute preferences.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-slate-100 p-4 space-y-2">
                        {[
                            { label: 'Profile', icon: User, active: true },
                            { label: 'Security', icon: Shield, active: false },
                            { label: 'Notifications', icon: Bell, active: false },
                            { label: 'Institute', icon: Globe, active: false },
                        ].map(item => (
                            <button
                                key={item.label}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-50 pb-6">Account Information</h3>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email}
                                    disabled
                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-slate-400 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Work/Role</label>
                                <input
                                    type="text"
                                    defaultValue={user?.role?.replace('_', ' ')}
                                    disabled
                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-slate-400 font-medium capitalize cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                Cancel
                            </button>
                            <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
