import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail?: string;
    instituteId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    price: number;
    tags: string[];
    isActive: boolean;
}

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        price: { type: Number, default: 0 },
        tags: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
