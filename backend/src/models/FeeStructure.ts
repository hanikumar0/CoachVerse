import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeStructure extends Document {
    name: string;
    courseId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    amount: number;
    description?: string;
    frequency: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
    isActive: boolean;
}

const FeeStructureSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        frequency: {
            type: String,
            enum: ['one_time', 'monthly', 'quarterly', 'yearly'],
            default: 'one_time'
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
