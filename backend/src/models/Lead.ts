import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    courseInterest?: string;
    status: 'new' | 'contacted' | 'demo_scheduled' | 'demo_attended' | 'enrolled' | 'lost';
    source: 'website' | 'referral' | 'walk_in' | 'social_media' | 'other';
    notes?: string;
    followUpDate?: Date;
    instituteId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId; // staffId
}

const LeadSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        courseInterest: { type: String },
        status: {
            type: String,
            enum: ['new', 'contacted', 'demo_scheduled', 'demo_attended', 'enrolled', 'lost'],
            default: 'new'
        },
        source: {
            type: String,
            enum: ['website', 'referral', 'walk_in', 'social_media', 'other'],
            default: 'website'
        },
        notes: { type: String },
        followUpDate: { type: Date },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

export default mongoose.model<ILead>('Lead', LeadSchema);
