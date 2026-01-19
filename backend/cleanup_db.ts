import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to DB...');

        const result = await User.updateMany(
            { username: "" },
            { $unset: { username: 1 } }
        );
        console.log(`Cleaned up ${result.modifiedCount} users with empty usernames.`);

        const result2 = await User.updateMany(
            { gmailId: "" },
            { $unset: { gmailId: 1 } }
        );
        console.log(`Cleaned up ${result2.modifiedCount} users with empty gmailIds.`);

        const result3 = await User.updateMany(
            { mailId: "" },
            { $unset: { mailId: 1 } }
        );
        console.log(`Cleaned up ${result3.modifiedCount} users with empty mailIds.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
