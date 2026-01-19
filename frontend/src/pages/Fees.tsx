import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Wallet,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    Banknote,
    ChevronRight,
    Loader2,
    Calendar,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

const Fees = () => {
    const { user } = useAuthStore();
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');
    const isStudentOrParent = ['student', 'parent'].includes(user?.role || '');

    const [activeTab, setActiveTab] = useState(isAdmin ? 'all' : 'my');
    const [payments, setPayments] = useState<any[]>([]);
    const [structures, setStructures] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingAmount: 0,
        paidCount: 0,
        pendingCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showStructureModal, setShowStructureModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [paymentForm, setPaymentForm] = useState({
        amountPaid: '',
        paymentMethod: 'cash',
        transactionId: '',
        remarks: ''
    });

    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);

    const [structureForm, setStructureForm] = useState({
        name: '',
        courseId: '',
        amount: '',
        description: '',
        frequency: 'one_time'
    });

    const [assignForm, setAssignForm] = useState({
        feeStructureId: '',
        batchId: '',
        dueDate: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (isAdmin) {
                const [payRes, strRes, statRes, courseRes, batchRes] = await Promise.all([
                    api.get('/fees/all'),
                    api.get('/fees/structures'),
                    api.get('/fees/stats'),
                    api.get('/courses'),
                    api.get('/batches')
                ]);
                setPayments(payRes.data);
                setStructures(strRes.data);
                setStats(statRes.data);
                setCourses(courseRes.data);
                setBatches(batchRes.data);
            } else {
                const payRes = await api.get('/fees/my-payments');
                setPayments(payRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/fees/record/${selectedPayment._id}`, paymentForm);
            setShowPayModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateStructure = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/fees/structures', structureForm);
            setShowStructureModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignFee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/fees/assign', assignForm);
            setShowAssignModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'partially_paid': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fee Management</h1>
                        <p className="text-slate-500 mt-1">Manage institute finances and student payments</p>
                    </div>
                    {isAdmin && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStructureModal(true)}
                                className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                                New Structure
                            </button>
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <Banknote className="w-5 h-5 mr-2" />
                                Generate Invoices
                            </button>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Pending Dues', value: `₹${stats.pendingAmount.toLocaleString()}`, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Paid Invoices', value: stats.paidCount, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Pending Invoices', value: stats.pendingCount, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
                            >
                                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="flex border-b border-slate-200 mb-8 gap-8">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`pb-4 px-2 font-semibold transition-all relative ${activeTab === 'all' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                All Payments
                                {activeTab === 'all' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('structures')}
                                className={`pb-4 px-2 font-semibold transition-all relative ${activeTab === 'structures' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Fee Structures
                                {activeTab === 'structures' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                            </button>
                        </>
                    ) : (
                        <button
                            className="pb-4 px-2 font-semibold text-indigo-600 relative"
                        >
                            My Payments
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        {activeTab === 'all' || activeTab === 'my' ? (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Student</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Fee Type</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Amount</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Paid</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Due Date</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-20 text-center">
                                                <div className="max-w-xs mx-auto">
                                                    <Banknote className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-slate-900">No payments found</h3>
                                                    <p className="text-slate-500 mt-1">Payment records will appear here after invoices are generated.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((p) => (
                                            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{p.studentId?.name}</p>
                                                        <p className="text-xs text-slate-500">{p.studentId?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-medium text-slate-700">{p.feeStructureId?.name}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-slate-900">₹{p.amountToPay.toLocaleString()}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className={`font-bold ${p.amountPaid > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        ₹{p.amountPaid.toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm text-slate-600 font-medium">
                                                        {new Date(p.dueDate).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusStyle(p.status)}`}>
                                                        {p.status.toUpperCase().replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    {isAdmin && p.status !== 'paid' ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPayment(p);
                                                                setPaymentForm({
                                                                    amountPaid: (p.amountToPay - p.amountPaid).toString(),
                                                                    paymentMethod: 'cash',
                                                                    transactionId: '',
                                                                    remarks: ''
                                                                });
                                                                setShowPayModal(true);
                                                            }}
                                                            className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all text-sm"
                                                        >
                                                            Record Payment
                                                        </button>
                                                    ) : (
                                                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Name</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Course</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Amount</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider">Frequency</th>
                                        <th className="px-8 py-5 text-sm font-bold text-slate-900 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {structures.map((s) => (
                                        <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-slate-900">{s.name}</td>
                                            <td className="px-8 py-5 font-medium text-slate-600">{s.courseId?.name}</td>
                                            <td className="px-8 py-5 font-bold text-slate-900">₹{s.amount.toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    {s.frequency.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`w-3 h-3 rounded-full inline-block ${s.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Pay Modal */}
            <AnimatePresence>
                {showPayModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPayModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Record Payment</h2>
                            <p className="text-slate-500 text-center mb-8">Mark student fee as paid</p>

                            <form onSubmit={handleRecordPayment} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Amount Paid (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={paymentForm.amountPaid}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                                    <select
                                        value={paymentForm.paymentMethod}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Confirm Payment
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Structure Modal */}
            <AnimatePresence>
                {showStructureModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStructureModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 shadow-2xl">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">New Fee Structure</h2>
                            <form onSubmit={handleCreateStructure} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Structure Name</label>
                                        <input type="text" required placeholder="e.g. Admission Fee 2024" value={structureForm.name} onChange={(e) => setStructureForm({ ...structureForm, name: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Course</label>
                                        <select required value={structureForm.courseId} onChange={(e) => setStructureForm({ ...structureForm, courseId: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200">
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Amount (₹)</label>
                                        <input type="number" required value={structureForm.amount} onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                                        <select required value={structureForm.frequency} onChange={(e) => setStructureForm({ ...structureForm, frequency: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200">
                                            <option value="one_time">One Time</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowStructureModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                                    <button type="submit" className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all px-12">Save Structure</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Assign Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssignModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 shadow-2xl">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Generate Invoices</h2>
                            <p className="text-slate-500 mb-8">Assign a fee structure to all students in a batch.</p>
                            <form onSubmit={handleAssignFee} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fee Structure</label>
                                    <select required value={assignForm.feeStructureId} onChange={(e) => setAssignForm({ ...assignForm, feeStructureId: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200">
                                        <option value="">Select Structure</option>
                                        {structures.map(s => <option key={s._id} value={s._id}>{s.name} (₹{s.amount})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Batch</label>
                                    <select required value={assignForm.batchId} onChange={(e) => setAssignForm({ ...assignForm, batchId: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200">
                                        <option value="">Select Batch</option>
                                        {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                                    <input type="date" required value={assignForm.dueDate} onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200" />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                                    <button type="submit" className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all px-12">Generate Now</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </DashboardLayout>
    );
};

export default Fees;
