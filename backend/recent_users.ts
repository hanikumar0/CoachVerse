import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();
const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    const tenor = new Date(Date.now() - 10 * 60 * 1000);
    const users = await User.find({ createdAt: { $gt: tenor } });
    console.log('RECENT_USERS:', users.length);
    users.forEach(u => console.log(`${u.email} | ${u.role} | ${u.createdAt}`));
    process.exit(0);
};
check();
