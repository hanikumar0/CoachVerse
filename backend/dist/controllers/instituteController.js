import Institute from '../models/Institute.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
export const registerInstitute = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { instituteName, adminName, adminEmail, adminPassword, contactNumber, address } = req.body;
        // Check if user already exists
        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        // Create the Institute
        const institute = new Institute({
            name: instituteName,
            contactNumber,
            address,
            // We need the owner ID, but we haven't created the user yet.
            // We'll update this after creating the user.
            owner: new mongoose.Types.ObjectId()
        });
        // Create the Super Admin User
        const adminUser = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'super_admin',
            instituteId: institute._id,
            phoneNumber: contactNumber
        });
        // Update institute owner
        institute.owner = adminUser._id;
        await institute.save({ session });
        await adminUser.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            message: 'Institute and Admin account created successfully',
            institute: {
                id: institute._id,
                name: institute.name
            },
            admin: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email
            }
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};
export const getInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find({ isActive: true }).select('name logo');
        res.json(institutes);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=instituteController.js.map