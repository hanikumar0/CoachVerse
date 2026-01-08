import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    studentId: mongoose.Types.ObjectId;
    batchId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    markedBy: mongoose.Types.ObjectId; // Teacher or Admin
    date: Date;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    remarks?: string;
}

const AttendanceSchema: Schema = new Schema(
    {
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
    },
    { timestamps: true }
);

// Compound index to ensure one record per student per batch per date (optional, but good for data integrity)
// Note: Date passing from frontend might need normalization (start of day)
AttendanceSchema.index({ studentId: 1, batchId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
