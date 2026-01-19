import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const email = 'aryanpandey35247@gmail.com';
        const u = await User.findOne({ email });
        if (u) {
            console.log('--- USER DATA ---');
            console.log('ID:', u._id);
            console.log('Name:', u.name);
            console.log('Role:', u.role);
            console.log('Institute:', u.instituteId);
            console.log('-----------------');
        } else {
            console.log('User not found.');
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
