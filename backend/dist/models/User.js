import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'teacher', 'student', 'parent'],
        default: 'student'
    },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute' },
    phoneNumber: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    // Parent-Student Relationships
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parent: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map