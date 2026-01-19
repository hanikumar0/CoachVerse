import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected');

        const testUserData = {
            name: 'Test Null Institute',
            email: 'test_null_' + Date.now() + '@example.com',
            password: 'password123',
            role: 'teacher',
            instituteId: null // Test if null instituteId causes issues
        };

        console.log('Creating user...');
        const user = await User.create(testUserData);
        console.log('User created:', user._id);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('TEST ERROR:', err);
        process.exit(1);
    }
};

test();
