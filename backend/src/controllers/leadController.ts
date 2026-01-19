import { Response } from 'express';
import Lead from '../models/Lead.js';
import User from '../models/User.js';

// Public Inquiry (Unprotected)
export const createPublicLead = async (req: any, res: Response) => {
    try {
        const { name, email, phone, courseInterest, instituteId, source } = req.body;

        // Basic validation
        if (!instituteId) {
            return res.status(400).json({ message: 'Institute ID is required' });
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            courseInterest,
            instituteId,
            source: source || 'website',
            status: 'new'
        });

        res.status(201).json({ message: 'Inquiry submitted successfully', leadId: lead._id });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Create Lead (Admin/Staff)
export const createLead = async (req: any, res: Response) => {
    try {
        const lead = await Lead.create({
            ...req.body,
            instituteId: req.user.instituteId
        });
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get All Leads
export const getLeads = async (req: any, res: Response) => {
    try {
        const leads = await Lead.find({ instituteId: req.user.instituteId })
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update Lead Status/Info
export const updateLead = async (req: any, res: Response) => {
    try {
        const lead = await Lead.findOneAndUpdate(
            { _id: req.params.id, instituteId: req.user.instituteId },
            req.body,
            { new: true }
        );
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Delete Lead
export const deleteLead = async (req: any, res: Response) => {
    try {
        const lead = await Lead.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.user.instituteId
        });
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get Lead Stats
export const getLeadStats = async (req: any, res: Response) => {
    try {
        const leads = await Lead.find({ instituteId: req.user.instituteId });

        const stats = {
            total: leads.length,
            new: leads.filter(l => l.status === 'new').length,
            contacted: leads.filter(l => l.status === 'contacted').length,
            demo: leads.filter(l => ['demo_scheduled', 'demo_attended'].includes(l.status)).length,
            enrolled: leads.filter(l => l.status === 'enrolled').length,
            conversionRate: leads.length ? Math.round((leads.filter(l => l.status === 'enrolled').length / leads.length) * 100) : 0
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
