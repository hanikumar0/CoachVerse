import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent';
    instituteId: mongoose.Types.ObjectId;
    phoneNumber?: string;
    avatar?: string;
    isVerified: boolean;
    // For Parents
    children?: mongoose.Types.ObjectId[];
    // For Students (inverse relationship helper, optional but good for queries)
    parent?: mongoose.Types.ObjectId;
    // Methods
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
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
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default User;
