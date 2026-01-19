import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        const createdUser = await User.findOne({ email: 'aryanpandey35247@gmail.com' });
        const adminUser = await User.findOne({ email: 'hanikumar064@gmail.com' });

        console.log('--- DB INSPECTION ---');
        if (createdUser) {
            console.log('CREATED USER:', {
                email: createdUser.email,
                role: createdUser.role,
                instituteId: createdUser.instituteId?.toString()
            });
        } else {
            console.log('CREATED USER NOT FOUND');
        }

        if (adminUser) {
            console.log('ADMIN USER:', {
                email: adminUser.email,
                role: adminUser.role,
                instituteId: adminUser.instituteId?.toString()
            });
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
