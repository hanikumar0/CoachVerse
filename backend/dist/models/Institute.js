import mongoose, { Schema } from 'mongoose';
const InstituteSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('Institute', InstituteSchema);
//# sourceMappingURL=Institute.js.map