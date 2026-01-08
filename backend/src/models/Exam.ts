import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
    text: string;
    options: string[];
    correctAnswer: number; // Index of the correct option
    points: number;
}

export interface IExam extends Document {
    title: string;
    description: string;
    courseId: mongoose.Types.ObjectId;
    batchId: mongoose.Types.ObjectId;
    creatorId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    questions: IQuestion[];
    duration: number; // in minutes
    startTime: Date;
    endTime: Date;
    passPercentage: number;
    isActive: boolean;
}

const ExamSchema: Schema = new Schema(
    {
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
    },
    { timestamps: true }
);

export default mongoose.model<IExam>('Exam', ExamSchema);
