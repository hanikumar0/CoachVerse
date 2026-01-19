import { Request, Response } from 'express';
import FeeStructure from '../models/FeeStructure.js';
import FeePayment from '../models/FeePayment.js';
import User from '../models/User.js';
import Batch from '../models/Batch.js';
import mongoose from 'mongoose';

// Create Fee Structure
export const createFeeStructure = async (req: any, res: Response) => {
    try {
        const { name, courseId, amount, description, frequency } = req.body;

        const feeStructure = await FeeStructure.create({
            name,
            courseId,
            amount,
            description,
            frequency,
            instituteId: req.user.instituteId
        });

        res.status(201).json(feeStructure);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get Fee Structures
export const getFeeStructures = async (req: any, res: Response) => {
    try {
        const feeStructures = await FeeStructure.find({ instituteId: req.user.instituteId })
            .populate('courseId', 'name');
        res.json(feeStructures);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Assign Fee to Batch Students (Generate Invoices)
export const assignFeeToBatch = async (req: any, res: Response) => {
    try {
        const { feeStructureId, batchId, dueDate } = req.body;

        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure) return res.status(404).json({ message: 'Fee structure not found' });

        const batch = await Batch.findById(batchId);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        const students = await User.find({ _id: { $in: batch.students } });

        const payments = students.map(student => ({
            studentId: student._id,
            feeStructureId: feeStructure._id,
            instituteId: req.user.instituteId,
            amountToPay: feeStructure.amount,
            dueDate: new Date(dueDate),
            status: 'pending'
        }));

        await FeePayment.insertMany(payments);

        res.status(201).json({ message: `Invoices generated for ${students.length} students` });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Record Payment
export const recordPayment = async (req: any, res: Response) => {
    try {
        const { paymentId } = req.params;
        const { amountPaid, paymentMethod, transactionId, remarks } = req.body;

        const payment = await FeePayment.findById(paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment record not found' });

        payment.amountPaid += Number(amountPaid);
        payment.paymentMethod = paymentMethod;
        payment.transactionId = transactionId;
        payment.remarks = remarks;
        payment.paymentDate = new Date();

        if (payment.amountPaid >= payment.amountToPay) {
            payment.status = 'paid';
        } else if (payment.amountPaid > 0) {
            payment.status = 'partially_paid';
        }

        await payment.save();
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get All Payments (Admin)
export const getAllPayments = async (req: any, res: Response) => {
    try {
        const payments = await FeePayment.find({ instituteId: req.user.instituteId })
            .populate('studentId', 'name email phoneNumber')
            .populate('feeStructureId', 'name')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get My Payments (Student/Parent)
export const getMyPayments = async (req: any, res: Response) => {
    try {
        let studentIds = [req.user._id];

        if (req.user.role === 'parent') {
            studentIds = req.user.children || [];
        }

        const payments = await FeePayment.find({ studentId: { $in: studentIds } })
            .populate('studentId', 'name')
            .populate('feeStructureId', 'name')
            .sort({ dueDate: 1 });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get Financial Stats
export const getFinancialStats = async (req: any, res: Response) => {
    try {
        const payments = await FeePayment.find({ instituteId: req.user.instituteId });

        const stats = {
            totalRevenue: payments.reduce((acc, curr) => acc + curr.amountPaid, 0),
            pendingAmount: payments.reduce((acc, curr) => acc + (curr.amountToPay - curr.amountPaid), 0),
            paidCount: payments.filter(p => p.status === 'paid').length,
            pendingCount: payments.filter(p => p.status === 'pending' || p.status === 'partially_paid').length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
