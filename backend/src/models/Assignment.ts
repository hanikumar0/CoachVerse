import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    description: string;
    courseId: mongoose.Types.ObjectId;
    batchId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    deadline: Date;
    totalPoints: number;
    attachments: string[];
    isActive: boolean;
}

const AssignmentSchema: Schema = new Schema(
    {
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
    },
    { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
