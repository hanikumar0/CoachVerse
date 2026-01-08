import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Batch from './models/Batch.js';
import Institute from './models/Institute.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coachverse');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Batch.deleteMany({});
        await Institute.deleteMany({});

        const seedPassword = process.env.INITIAL_SEED_PASSWORD || 'CoachVerse@2026';

        // 1. Create Super Admin
        const superAdmin = await User.create({
            name: 'Global Admin',
            email: 'admin@coachverse.com',
            password: seedPassword,
            role: 'super_admin',
            isVerified: true
        });

        // 2. Create Institutes
        const inst1 = await Institute.create({
            name: 'Elite Tech Institute',
            owner: superAdmin._id,
            address: '123 Silicon Square, Bangalore',
            contactNumber: '9123456789'
        });

        const inst2 = await Institute.create({
            name: 'Academy of Arts',
            owner: superAdmin._id,
            address: '45 Creative Lane, Mumbai',
            contactNumber: '9876543210'
        });

        // 3. Create Teachers
        const teacher1 = await User.create({
            name: 'Dr. Sarah Wilson',
            email: 'sarah@elite.com',
            password: seedPassword,
            role: 'teacher',
            instituteId: inst1._id,
            isVerified: true
        });

        const teacher2 = await User.create({
            name: 'Prof. Michael Ross',
            email: 'michael@academy.com',
            password: seedPassword,
            role: 'teacher',
            instituteId: inst1._id,
            isVerified: true
        });

        // 4. Create Students
        const student1 = await User.create({
            name: 'John Doe',
            email: 'student@coachverse.com',
            password: seedPassword,
            role: 'student',
            instituteId: inst1._id,
            isVerified: true
        });

        const student2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@coachverse.com',
            password: seedPassword,
            role: 'student',
            instituteId: inst1._id,
            isVerified: true
        });

        // 5. Create Parents
        const parent = await User.create({
            name: 'Mr. Robert Doe',
            email: 'parent@coachverse.com',
            password: seedPassword,
            role: 'parent',
            instituteId: inst1._id,
            phoneNumber: '9988776655',
            children: [student1._id],
            isVerified: true
        });

        // Link student back to parent
        await User.findByIdAndUpdate(student1._id, { parent: parent._id });

        // 6. Create Courses
        const course1 = await Course.create({
            title: 'Advanced React Architecture',
            description: 'Master design patterns and performance optimization.',
            price: 99,
            tags: ['React', 'Frontend'],
            instituteId: inst1._id,
            createdBy: superAdmin._id,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
        });

        const course2 = await Course.create({
            title: 'Full Stack Node.js',
            description: 'Build scalable backends with Express and Mongo.',
            price: 129,
            tags: ['Backend', 'Node.js'],
            instituteId: inst1._id,
            createdBy: superAdmin._id,
            thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800'
        });

        // 7. Create Batches
        await Batch.create({
            name: 'React Winter 2026',
            courseId: course1._id,
            teacherId: teacher1._id,
            instituteId: inst1._id,
            students: [student1._id, student2._id],
            startDate: new Date('2026-01-15'),
            schedule: [
                { day: 'Monday', startTime: '10:00 AM', endTime: '12:00 PM' },
                { day: 'Wednesday', startTime: '10:00 AM', endTime: '12:00 PM' }
            ]
        });

        await Batch.create({
            name: 'Node Night Batch',
            courseId: course2._id,
            teacherId: teacher2._id,
            instituteId: inst1._id,
            students: [student1._id],
            startDate: new Date('2026-02-01'),
            schedule: [
                { day: 'Tuesday', startTime: '06:00 PM', endTime: '08:00 PM' },
                { day: 'Thursday', startTime: '06:00 PM', endTime: '08:00 PM' }
            ]
        });

        console.log('Master seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
