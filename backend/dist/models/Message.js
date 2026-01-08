import mongoose, { Schema } from 'mongoose';
const MessageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Message', MessageSchema);
//# sourceMappingURL=Message.js.map