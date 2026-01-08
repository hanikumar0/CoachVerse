import mongoose, { Schema } from 'mongoose';
const AnnouncementSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('Announcement', AnnouncementSchema);
//# sourceMappingURL=Announcement.js.map