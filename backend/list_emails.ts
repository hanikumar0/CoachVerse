import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();
const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    const users = await User.find({}).select('email');
    console.log('TOTAL_USERS:', users.length);
    users.forEach(u => console.log(u.email));
    process.exit(0);
};
check();
