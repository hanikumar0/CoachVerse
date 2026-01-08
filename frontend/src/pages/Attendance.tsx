import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../api/axios';
import { CheckCircle2, XCircle, Clock, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Attendance = () => {
    const [batches, setBatches] = useState<any[]>([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                // Fetch batches relevant to the user (teacher/admin)
                const { data } = await api.get('/batches');
                setBatches(data);
                if (data.length > 0) setSelectedBatch(data[0]._id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBatches();
    }, []);

    useEffect(() => {
        if (!selectedBatch) return;
        const fetchStudentsAndAttendance = async () => {
            setLoading(true);
            try {
                // 1. Get Students in Batch (Assuming batch object has students array or we fetch by batchId)
                // We might need a specific endpoint to get students of a batch
                // For now, let's assume GET /batches/:id populates students
                const { data: batchData } = await api.get(`/batches/${selectedBatch}`);
                // Assuming batchData.students is populated with user objects
                setStudents(batchData.students || []);

                // 2. Check if attendance already marked for this date
                const { data: existingAttendance } = await api.get(`/attendance?batchId=${selectedBatch}&date=${date}`);

                const initialStatus: Record<string, string> = {};

                // If records exist, map them
                if (existingAttendance && existingAttendance.length > 0) {
                    existingAttendance.forEach((record: any) => {
                        initialStatus[record.studentId._id] = record.status;
                    });
                } else {
                    // Default to Present
                    batchData.students?.forEach((s: any) => {
                        initialStatus[s._id] = 'Present';
                    });
                }
                setAttendanceData(initialStatus);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentsAndAttendance();
    }, [selectedBatch, date]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAttendance = async () => {
        try {
            const records = Object.keys(attendanceData).map(studentId => ({
                studentId,
                status: attendanceData[studentId]
            }));

            await api.post('/attendance', {
                batchId: selectedBatch,
                date,
                records
            });
            alert('Attendance saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save attendance');
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Attendance</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Mark & Track Daily Presence</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                        onClick={submitAttendance}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                    >
                        <Save className="w-4 h-4" />
                        Save Record
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Batch Selector */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Select Batch</h3>
                        <div className="space-y-2">
                            {batches.map(batch => (
                                <button
                                    key={batch._id}
                                    onClick={() => setSelectedBatch(batch._id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${selectedBatch === batch._id
                                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                        }`}
                                >
                                    {batch.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Student List */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Student List ({students.length})</h3>
                            <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Present</span>
                                <span className="flex items-center gap-1 text-rose-600"><XCircle className="w-3 h-3" /> Absent</span>
                                <span className="flex items-center gap-1 text-amber-500"><Clock className="w-3 h-3" /> Late</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
                        ) : (
                            <div className="max-h-[600px] overflow-y-auto">
                                {students.map((student, i) => (
                                    <motion.div
                                        key={student._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{student.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex bg-slate-100 p-1 rounded-xl">
                                            {['Present', 'Absent', 'Late'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student._id, status)}
                                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${attendanceData[student._id] === status
                                                        ? status === 'Present' ? 'bg-white text-emerald-600 shadow-sm'
                                                            : status === 'Absent' ? 'bg-white text-rose-600 shadow-sm'
                                                                : 'bg-white text-amber-500 shadow-sm'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                {students.length === 0 && (
                                    <div className="p-12 text-center text-slate-400 font-bold">No students found in this batch.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Attendance;
