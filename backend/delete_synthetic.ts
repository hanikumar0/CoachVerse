import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const deleteSynthetic = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const result = await User.deleteMany({ email: /synthetic_test/i });
        console.log(`DELETED: ${result.deletedCount} synthetic user(s).`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

deleteSynthetic();
