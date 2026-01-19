import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();
const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    const u1 = await User.findOne({ email: 'aryanpandey35247@gmail.com' });
    const u2 = await User.findOne({ email: 'hanikumar064@gmail.com' });
    console.log('--- START ---');
    console.log('ARYAN:', u1?.email, 'INST:', u1?.instituteId);
    console.log('ADMIN:', u2?.email, 'INST:', u2?.instituteId);
    console.log('--- END ---');
    process.exit(0);
};
check();
