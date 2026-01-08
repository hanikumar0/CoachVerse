import mongoose, { Schema } from 'mongoose';
const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, default: 0 },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Course', CourseSchema);
//# sourceMappingURL=Course.js.map