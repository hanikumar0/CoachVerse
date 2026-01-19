import { Request, Response } from 'express';
import Room from '../models/Room.js';

export const createRoom = async (req: any, res: Response) => {
    try {
        const { name, capacity, resources } = req.body;
        const room = await Room.create({
            name,
            capacity,
            resources,
            instituteId: req.user.instituteId
        });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getRooms = async (req: any, res: Response) => {
    try {
        const rooms = await Room.find({ instituteId: req.user.instituteId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateRoom = async (req: any, res: Response) => {
    try {
        const room = await Room.findOneAndUpdate(
            { _id: req.params.id, instituteId: req.user.instituteId },
            req.body,
            { new: true }
        );
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteRoom = async (req: any, res: Response) => {
    try {
        const room = await Room.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.user.instituteId
        });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
