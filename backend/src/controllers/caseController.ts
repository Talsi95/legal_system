import { Request, Response } from 'express';
import Case from '../models/Case';

// יצירת תיק חדש - רק עורך דין יכול
export const createCase = async (req: any, res: Response) => {
  try {
    const { title, clientEmail, status } = req.body;
    
    // מציאת הלקוח לפי אימייל (אפשר גם לפי ID)
    const User = require('../models/User').default;
    const client = await User.findOne({ email: clientEmail.toLowerCase() });
    
    if (!client) return res.status(404).json({ msg: 'Client not found' });

    const newCase = new Case({
      title,
      lawyer: req.user.id, // נלקח מה-Token
      client: client._id,
      status
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// שליפת תיקים - לקוח רואה רק את שלו, עורך דין רואה את כולם
export const getCases = async (req: any, res: Response) => {
  try {
    let query = {};
    if (req.user.role === 'lawyer') {
      query = { lawyer: req.user.id };
    } else {
      query = { client: req.user.id };
    }

    const cases = await Case.find(query).populate('client lawyer', 'name email');
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// הוספת עדכון לציר הזמן (Timeline)
export const addUpdate = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const legalCase = await Case.findById(req.params.id);
    
    if (!legalCase) return res.status(404).json({ msg: 'Case not found' });

    legalCase.timeline.unshift({ title, description, date: new Date() });
    await legalCase.save();

    res.json(legalCase);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// הוספת מועד חשוב (Deadline)
export const addDeadline = async (req: Request, res: Response) => {
  try {
    const { task, dueDate } = req.body;
    const legalCase = await Case.findById(req.params.id);

    if (!legalCase) return res.status(404).json({ msg: 'Case not found' });

    legalCase.deadlines.push({ task, dueDate, isCompleted: false });
    await legalCase.save();

    res.json(legalCase);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};