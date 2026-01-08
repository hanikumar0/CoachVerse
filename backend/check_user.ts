import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coachverse');
        const user = await User.findOne({ email: 'admin@coachverse.com' }).select('+password');
        if (user) {
            console.log('User found:', user.email);
            console.log('Hashed Password:', user.password);

            // Try to manually compare with 'password123'
            const bcrypt = (await import('bcryptjs')).default;
            const isMatch = await bcrypt.compare('password123', user.password!);
            console.log('Manual match with password123:', isMatch);
        } else {
            console.log('User not found');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
