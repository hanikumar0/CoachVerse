import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const solve = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const email = 'aryanpandey35247@gmail.com';
        const result = await User.deleteOne({ email });
        if (result.deletedCount > 0) {
            console.log(`SUCCESS: Deleted existing user with email ${email}. You can now create the user again.`);
        } else {
            console.log(`INFO: No user found with email ${email}.`);
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

solve();
