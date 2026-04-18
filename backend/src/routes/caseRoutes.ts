import { Router } from 'express';
import { createCase, getCases, addUpdate, addDeadline } from '../controllers/caseController';
import { authMiddleware, lawyerOnly } from '../middleware/auth';

const router = Router();

// כל הנתיבים כאן דורשים התחברות
router.use(authMiddleware);

router.get('/', getCases); // גם עורך דין וגם לקוח (הסינון מתבצע ב-Controller)
router.post('/', lawyerOnly, createCase); // רק עורך דין (כדאי להוסיף Role Middleware כאן)
router.patch('/:id/update', addUpdate);
router.patch('/:id/deadline', addDeadline);

export default router;