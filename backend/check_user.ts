import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

console.log('--- SCRIPT START ---');
dotenv.config({ path: path.join(process.cwd(), '.env') });

const checkUser = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected!');
        const email = 'aryanpandey35247@gmail.com';
        const userByEmail = await User.findOne({ email });
        console.log('User by email result:', userByEmail ? 'USER FOUND' : 'USER NOT FOUND');

        if (userByEmail) {
            console.log('User ID:', userByEmail._id);
            console.log('User Email:', userByEmail.email);
            console.log('User Username:', userByEmail.username);
        }

        const usernameCheck = await User.findOne({ username: "" });
        console.log('User with empty username result:', usernameCheck ? 'FOUND' : 'NOT FOUND');

        await mongoose.disconnect();
        console.log('--- SCRIPT END ---');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

checkUser();
