import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const list = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const users = await User.find({}).select('email username role');
        console.log('--- ALL USERS ---');
        users.forEach(u => console.log(`${u.email} | ${u.username || 'N/A'} | ${u.role}`));
        console.log('-----------------');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

list();
