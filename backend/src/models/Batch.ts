import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch extends Document {
    name: string;
    courseId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    schedule: Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    startDate: Date;
    endDate?: Date;
    students: mongoose.Types.ObjectId[];
    isActive: boolean;
}

const BatchSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        schedule: [
            {
                day: { type: String, required: true },
                startTime: { type: String, required: true },
                endTime: { type: String, required: true },
            }
        ],
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IBatch>('Batch', BatchSchema);
