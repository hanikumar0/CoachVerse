import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const users = await User.find({ email: /aryan/i });
        console.log('USERS_MATCHING_ARYAN:', users.length);
        users.forEach(u => {
            console.log(`- ${u.email} (${u.role}) ID: ${u._id}`);
        });
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
