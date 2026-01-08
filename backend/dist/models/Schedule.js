import mongoose, { Schema } from 'mongoose';
const ScheduleSchema = new Schema({
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
    roomNumber: { type: String },
    meetingLink: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Schedule', ScheduleSchema);
//# sourceMappingURL=Schedule.js.map