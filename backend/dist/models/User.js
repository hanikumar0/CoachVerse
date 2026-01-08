import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'teacher', 'student', 'parent', 'support'],
        default: 'student',
    },
    avatar: { type: String },
    phoneNumber: { type: String },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });
// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    catch (err) {
        throw err;
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map