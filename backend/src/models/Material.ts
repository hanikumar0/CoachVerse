import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
    title: string;
    description: string;
    fileUrl: string;
    fileType: 'PDF' | 'Video' | 'Link' | 'Zip' | 'Other';
    courseId: mongoose.Types.ObjectId;
    batchId?: mongoose.Types.ObjectId;
    uploaderId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    isPublic: boolean;
}

const MaterialSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        fileUrl: { type: String, required: true },
        fileType: {
            type: String,
            enum: ['PDF', 'Video', 'Link', 'Zip', 'Other'],
            default: 'PDF'
        },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
        uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        isPublic: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IMaterial>('Material', MaterialSchema);
