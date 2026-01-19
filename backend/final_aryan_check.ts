import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const u = await User.findOne({ email: 'aryanpandey35247@gmail.com' });
        if (u) {
            console.log('--- USER FOUND ---');
            console.log('Email:', u.email);
            console.log('InstituteId:', u.instituteId);
            console.log('--- END ---');
        } else {
            console.log('--- USER NOT FOUND ---');
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
