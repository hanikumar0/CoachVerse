import mongoose, { Schema } from 'mongoose';
const AttendanceSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        required: true
    },
    remarks: { type: String }
}, { timestamps: true });
// Compound index to ensure one record per student per batch per date (optional, but good for data integrity)
// Note: Date passing from frontend might need normalization (start of day)
AttendanceSchema.index({ studentId: 1, batchId: 1, date: 1 }, { unique: true });
export default mongoose.model('Attendance', AttendanceSchema);
//# sourceMappingURL=Attendance.js.map