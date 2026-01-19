console.log('--- START ---');
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();
console.log('URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');

const test = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected');

        const testUserData = {
            name: 'Test Teacher',
            email: 'test_teacher_' + Date.now() + '@example.com',
            password: 'password123',
            role: 'teacher',
        };

        console.log('Creating user...');
        const user = await User.create(testUserData);
        console.log('User created:', user._id);

        await mongoose.disconnect();
        console.log('--- END ---');
        process.exit(0);
    } catch (err) {
        console.error('TEST ERROR:', err);
        process.exit(1);
    }
};

test();
