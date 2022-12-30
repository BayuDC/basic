import { Router } from 'express';
import handler from '../handlers/user';
import auth from '../helpers/auth';

const router = Router();

router.param('id', handler.load);

router.use(auth.guard());
router.get('/api/users', handler.index);
router.get('/api/users/:id', handler.show);
router.use(auth.gate('admin'));
router.post('/api/users', handler.store);
router.put('/api/users/:id', handler.update);

export default router;
