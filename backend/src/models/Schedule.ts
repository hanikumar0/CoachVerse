import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
    batchId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // e.g. "09:00"
    endTime: string;   // e.g. "10:30"
    roomId?: mongoose.Types.ObjectId;
    roomNumber?: string; // Legacy/Fallback
    meetingLink?: string;
    isActive: boolean;
}

const ScheduleSchema: Schema = new Schema(
    {
        batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        dayOfWeek: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
        roomNumber: { type: String },
        meetingLink: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);
