import { Router } from 'express';
import { createCase, getCases, addUpdate, addDeadline, toggleUpdateStatus, deleteUpdate } from '../controllers/caseController';
import { authMiddleware, lawyerOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getCases);
router.post('/', lawyerOnly, createCase);
router.patch('/:id/update', addUpdate);
router.patch('/:id/update/:updateId/toggle', lawyerOnly, toggleUpdateStatus);
router.patch('/:id/deadline', addDeadline);
router.delete('/:id/update/:updateId', lawyerOnly, deleteUpdate);

export default router;