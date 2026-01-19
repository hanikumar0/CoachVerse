import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const email = 'aryanpandey35247@gmail.com';
        const u = await User.findOne({ email });
        if (u) {
            console.log('USER_FOUND_START');
            console.log(JSON.stringify(u, null, 2));
            console.log('USER_FOUND_END');
        } else {
            console.log('USER_NOT_FOUND');
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findUser();
