import mongoose, { Schema } from 'mongoose';
const ExamSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
    questions: [
        {
            text: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true },
            points: { type: Number, default: 1 },
        },
    ],
    duration: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    passPercentage: { type: Number, default: 40 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Exam', ExamSchema);
//# sourceMappingURL=Exam.js.map