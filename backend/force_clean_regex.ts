import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const result = await User.deleteMany({ email: /aryan/i });
        console.log('DELETED COUNT:', result.deletedCount);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clean();
