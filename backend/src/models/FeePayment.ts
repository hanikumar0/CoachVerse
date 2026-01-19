import mongoose, { Schema, Document } from 'mongoose';

export interface IFeePayment extends Document {
    studentId: mongoose.Types.ObjectId;
    feeStructureId: mongoose.Types.ObjectId;
    instituteId: mongoose.Types.ObjectId;
    amountToPay: number;
    amountPaid: number;
    paymentDate?: Date;
    dueDate: Date;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
    paymentMethod?: 'cash' | 'bank_transfer' | 'online' | 'cheque';
    transactionId?: string;
    remarks?: string;
}

const FeePaymentSchema: Schema = new Schema(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        feeStructureId: { type: Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        amountToPay: { type: Number, required: true },
        amountPaid: { type: Number, default: 0 },
        paymentDate: { type: Date },
        dueDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'paid', 'partially_paid', 'overdue'],
            default: 'pending'
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank_transfer', 'online', 'cheque']
        },
        transactionId: { type: String },
        remarks: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model<IFeePayment>('FeePayment', FeePaymentSchema);
