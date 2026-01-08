import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    instituteId: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    title: string;
    content: string;
    targetRoles: string[]; // ['student', 'teacher', 'parent', 'all']
    type: 'info' | 'alert' | 'event';
    createdAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
    {
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        targetRoles: {
            type: [String],
            enum: ['student', 'teacher', 'parent', 'admin', 'all'],
            default: ['all']
        },
        type: {
            type: String,
            enum: ['info', 'alert', 'event'],
            default: 'info'
        }
    },
    { timestamps: true }
);

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
