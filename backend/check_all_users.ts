import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coachverse');
        const users = await User.find({}).select('+password');
        for (const user of users) {
            const bcrypt = (await import('bcryptjs')).default;
            const isMatch = await bcrypt.compare('password123', user.password!);
            console.log(`User: ${user.email}, Role: ${user.role}, Match: ${isMatch}`);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
