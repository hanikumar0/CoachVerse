import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();

const create = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const admin = await User.findOne({ email: 'hanikumar064@gmail.com' });

        const email = 'synthetic_test_' + Date.now() + '@example.com';
        const user = await User.create({
            name: 'Synthetic Test',
            email: email,
            password: 'password123',
            role: 'teacher',
            instituteId: admin?.instituteId
        });
        console.log('CREATED:', user.email, 'ID:', user._id);

        const found = await User.findOne({ email });
        console.log('VERIFIED_IN_DB:', found ? 'YES' : 'NO');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
create();
