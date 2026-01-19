import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();
const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    const count = await User.countDocuments({ email: 'aryanpandey35247@gmail.com' });
    console.log('COUNT:', count);
    if (count === 0) {
        const any = await User.findOne({ email: /aryan/i });
        console.log('ANY MATCH:', any?.email);
    }
    process.exit(0);
};
check();
