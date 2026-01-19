import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
    name: string;      // e.g. "Room 101", "Lab A"
    capacity: number;
    instituteId: mongoose.Types.ObjectId;
    resources?: string[]; // e.g. ["Projector", "Whiteboard", "Computers"]
    isActive: boolean;
}

const RoomSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        capacity: { type: Number, required: true, default: 30 },
        instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
        resources: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Ensure room names are unique within an institute
RoomSchema.index({ instituteId: 1, name: 1 }, { unique: true });

export default mongoose.model<IRoom>('Room', RoomSchema);
