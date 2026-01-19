import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const email = 'aryanpandey35247@gmail.com';
        const result = await User.deleteMany({ email });
        console.log('DELETED COUNT:', result.deletedCount);

        // Also clean up any partial matches if any
        const result2 = await User.deleteMany({ name: 'aryan' });
        console.log('DELETED BY NAME:', result2.deletedCount);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clean();
