import mongoose, { Schema } from 'mongoose';
const AssignmentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
    deadline: { type: Date, required: true },
    totalPoints: { type: Number, default: 100 },
    attachments: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Assignment', AssignmentSchema);
//# sourceMappingURL=Assignment.js.map