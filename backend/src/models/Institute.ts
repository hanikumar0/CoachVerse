import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitute extends Document {
    name: string;
    subdomain?: string;
    logo?: string;
    owner: mongoose.Types.ObjectId;
    settings: {
        primaryColor: string;
        accentColor: string;
    };
    address?: string;
    contactNumber?: string;
    isActive: boolean;
}

const InstituteSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        subdomain: { type: String, unique: true, sparse: true },
        logo: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        settings: {
            primaryColor: { type: String, default: '#4f46e5' },
            accentColor: { type: String, default: '#4338ca' },
        },
        address: { type: String },
        contactNumber: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IInstitute>('Institute', InstituteSchema);
