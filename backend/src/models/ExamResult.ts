import mongoose, { Schema, Document } from 'mongoose';

export interface IExamResult extends Document {
    examId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    answers: number[]; // Index of answers given for each question
    score: number;
    totalPossible: number;
    percentage: number;
    passed: boolean;
    submittedAt: Date;
}

const ExamResultSchema: Schema = new Schema(
    {
        examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        answers: [{ type: Number }],
        score: { type: Number, required: true },
        totalPossible: { type: Number, required: true },
        percentage: { type: Number, required: true },
        passed: { type: Boolean, required: true },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Optional: Prevent multiple attempts per exam
ExamResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
