import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, ShieldCheck, X, UserPlus, Loader2, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

const Users = () => {
    const { user } = useAuthStore();
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');
    const [users, setUsers] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]); // To populate parent-student search
    const [isLoading, setIsLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        phoneNumber: '',
        children: [] as string[] // Array of Student IDs
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get(`/auth/users${filterRole ? `?role=${filterRole}` : ''}`);
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudentsForLinking = async () => {
        try {
            const { data } = await api.get('/auth/users?role=student');
            setAllStudents(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole]);

    useEffect(() => {
        if (showModal && formData.role === 'parent') {
            fetchStudentsForLinking();
        }
    }, [formData.role, showModal]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/create-user', formData);
            setShowModal(false);
            fetchUsers();
            alert(`New ${formData.role} created successfully!`);
            setFormData({ name: '', email: '', password: '', role: 'student', phoneNumber: '', children: [] });
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    const toggleStudentLink = (studentId: string) => {
        setFormData(prev => {
            const children = prev.children.includes(studentId)
                ? prev.children.filter(id => id !== studentId)
                : [...prev.children, studentId];
            return { ...prev, children };
        });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Directory of Students & Staff</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add New User
                    </button>
                )}
            </div>

            {/* Same Search bars... */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                    />
                </div>
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
                    {['', 'teacher', 'student', 'parent'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filterRole === role ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {role || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none border-none">Profile</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none border-none">Access Level</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none border-none">Contact Info</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none border-none">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 border-none">
                        {isLoading ? (
                            <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /></td></tr>
                        ) : users.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-50/50 transition-all border-none group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg uppercase shadow-sm">
                                            {u.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-tight mb-0.5 text-sm tracking-tight">{u.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.role === 'teacher' ? 'bg-emerald-50 text-emerald-600' :
                                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        <ShieldCheck className="w-3 h-3" />
                                        {u.role}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <button className="hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all"><Mail className="w-4 h-4" /></button>
                                        <button className="hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all"><Phone className="w-4 h-4" /></button>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-300 hover:text-indigo-600 transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Users Modal with Parent Linking */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Onboard User</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="p-8 space-y-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                                        <input required type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Role</label>
                                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-xs uppercase">
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="parent">Parent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number (Optional)</label>
                                    <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="+1 234 567 8900" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none font-bold text-sm" />
                                </div>

                                {/* Parent Linking Logic */}
                                {formData.role === 'parent' && (
                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                                            <LinkIcon className="w-4 h-4" />
                                            <span className="text-xs uppercase tracking-wide">Link Students (Children)</span>
                                        </div>
                                        <div className="grid gap-2 max-h-40 overflow-y-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                            {allStudents.length === 0 ? (
                                                <p className="text-[10px] text-slate-400 text-center font-bold">No students found to link.</p>
                                            ) : (
                                                allStudents.map(student => (
                                                    <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-all">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.children.includes(student._id)}
                                                            onChange={() => toggleStudentLink(student._id)}
                                                            className="w-4 h-4 accent-indigo-600 rounded-lg"
                                                        />
                                                        <span className="text-sm font-bold text-slate-700">{student.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 ml-auto uppercase">{student.email}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Account</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Users;
