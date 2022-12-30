import { Router } from 'express';
import handler from '../handlers/user';
import auth from '../handlers/auth';

const router = Router();

router.use(auth.guard);
router.get('/api/users', handler.index);
router.get('/api/users/:id', handler.show);

export default router;
