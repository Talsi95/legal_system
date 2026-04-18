import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// הגדרת ממשק להרחבת ה-Request של Express
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // שליפת הטומיקן מה-Header (מקובל להשתמש ב-'x-auth-token' או 'Authorization')
  const token = req.header('x-auth-token');

  // בדיקה אם אין טוקן
  if (!token) {
    return res.status(401).json({ msg: 'אין טוקן, הגישה נדחתה' });
  }

  try {
    // אימות הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

    // הזרקת פרטי המשתמש לתוך ה-Request
    req.user = decoded;
    
    next(); // ממשיכים לפונקציה הבאה (ל-Controller)
  } catch (err) {
    res.status(401).json({ msg: 'הטוקן אינו תקף' });
  }
};

// Middleware נוסף אופציונלי: בדיקה אם המשתמש הוא עורך דין בלבד
export const lawyerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'lawyer') {
    next();
  } else {
    res.status(403).json({ msg: 'גישה נדחתה: פעולה זו מורשית לעורכי דין בלבד' });
  }
};