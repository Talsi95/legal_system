import { Router } from 'express';
import { register, login, createClientByLawyer } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create-client', createClientByLawyer);

export default router;