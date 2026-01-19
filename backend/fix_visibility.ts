import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();
const fix = async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    const admin = await User.findOne({ email: 'hanikumar064@gmail.com' });
    if (admin && admin.instituteId) {
        const result = await User.updateOne(
            { email: 'aryanpandey35247@gmail.com' },
            { $set: { instituteId: admin.instituteId } }
        );
        console.log(`Updated ${result.modifiedCount} user(s).`);
    } else {
        console.log('Admin or InstituteId not found.');
    }
    process.exit(0);
};
fix();
