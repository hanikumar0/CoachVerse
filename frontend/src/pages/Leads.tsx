import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Phone,
    Mail,
    Trash2,
    Edit3,
    Loader2
} from 'lucide-react';
import api from '../api/axios';

const Leads = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, demo: 0, enrolled: 0, conversionRate: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        email: '',
        phone: '',
        courseInterest: '',
        source: 'walk_in',
        status: 'new',
        notes: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [leadsRes, statsRes] = await Promise.all([
                api.get('/leads'),
                api.get('/leads/stats')
            ]);
            setLeads(leadsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/leads/${formData._id}`, formData);
            } else {
                await api.post('/leads', formData);
            }
            setShowModal(false);
            fetchData();
            resetForm();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this lead?')) return;
        try {
            await api.delete(`/leads/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({ _id: '', name: '', email: '', phone: '', courseInterest: '', source: 'walk_in', status: 'new', notes: '' });
        setIsEditing(false);
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'demo_scheduled': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'demo_attended': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'enrolled': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'lost': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lead Pipeline</h1>
                        <p className="text-slate-500 mt-1">Track and convert potential students</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 uppercase text-xs tracking-wider"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Lead
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    {[
                        { label: 'New Leads', value: stats.new, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Contacted', value: stats.contacted, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'In Demo', value: stats.demo, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Enrolled', value: stats.enrolled, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Conversion', value: `${stats.conversionRate}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                            <h3 className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 outline-none focus:border-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="demo_scheduled">Demo Scheduled</option>
                        <option value="demo_attended">Demo Attended</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 w-8 h-8" /></div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Interest</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Source</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredLeads.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-10 text-slate-500 font-bold">No leads found</td></tr>
                                    ) : (
                                        filteredLeads.map((lead) => (
                                            <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5 font-bold text-slate-900">{lead.name}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${getStatusColor(lead.status)}`}>
                                                        {lead.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-medium text-slate-600">{lead.courseInterest || '-'}</td>
                                                <td className="px-8 py-5 text-sm">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-slate-600"><Phone className="w-3 h-3" /> {lead.phone}</div>
                                                        <div className="flex items-center gap-2 text-slate-500"><Mail className="w-3 h-3" /> {lead.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-bold uppercase text-slate-500">{lead.source.replace('_', ' ')}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setFormData(lead); setIsEditing(true); setShowModal(true); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(lead._id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
                            <h2 className="text-2xl font-black text-slate-900 mb-6">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone</label>
                                        <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Interested In</label>
                                        <input type="text" placeholder="e.g. PCM Class 12" value={formData.courseInterest} onChange={e => setFormData({ ...formData, courseInterest: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Source</label>
                                        <select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500">
                                            <option value="walk_in">Walk In</option>
                                            <option value="website">Website</option>
                                            <option value="referral">Referral</option>
                                            <option value="social_media">Social Media</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500">
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="demo_scheduled">Demo Scheduled</option>
                                        <option value="demo_attended">Demo Attended</option>
                                        <option value="enrolled">Enrolled</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Internal Notes</label>
                                    <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500 min-h-[80px]" />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                    {isEditing ? 'Update Lead' : 'Create Lead'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Leads;
