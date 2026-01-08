import mongoose, { Schema } from 'mongoose';
const SubmissionSchema = new Schema({
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
    content: { type: String },
    attachments: [{ type: String }],
    grade: { type: Number },
    feedback: { type: String },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Submitted', 'Graded', 'Late'], default: 'Submitted' },
}, { timestamps: true });
// Ensure a student can only submit once per assignment
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
export default mongoose.model('Submission', SubmissionSchema);
//# sourceMappingURL=Submission.js.map