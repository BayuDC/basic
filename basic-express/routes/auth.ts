import { Router } from 'express';
import handler from '../handlers/auth';
import helper from '../helpers/auth';

const router = Router();

router.get('/api/auth', helper.guard(), (req, res) => res.send({ user: req.user }));
router.post('/api/auth/login', handler.login);
router.post('/api/auth/logout', helper.guard(), handler.logout);

export default router;
