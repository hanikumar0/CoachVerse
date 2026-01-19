import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const admins = await User.find({ role: 'admin' });
        console.log('ADMINS FOUND:', admins.length);
        admins.forEach(a => {
            console.log(`- ${a.email}: instituteId=${a.instituteId}`);
        });
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
