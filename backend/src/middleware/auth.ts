import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'אין טוקן, הגישה נדחתה' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'הטוקן אינו תקף' });
  }
};

export const lawyerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'lawyer') {
    next();
  } else {
    res.status(403).json({ msg: 'גישה נדחתה: פעולה זו מורשית לעורכי דין בלבד' });
  }
};