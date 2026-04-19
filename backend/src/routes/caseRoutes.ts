import { Router } from 'express';
import { createCase, getCases, addUpdate, addDeadline } from '../controllers/caseController';
import { authMiddleware, lawyerOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getCases);
router.post('/', lawyerOnly, createCase);
router.patch('/:id/update', addUpdate);
router.patch('/:id/deadline', addDeadline);

export default router;