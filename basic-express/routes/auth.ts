import { Router } from 'express';
import handler from '../handlers/auth';

const router = Router();

router.get('/api/auth', handler.guard, (req, res) => res.send({ user: req.user }));
router.post('/api/auth/login', handler.login);

export default router;
