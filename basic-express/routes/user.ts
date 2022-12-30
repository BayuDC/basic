import { Router } from 'express';
import handler from '../handlers/user';
import schema from '../schemas/user';
import auth from '../helpers/auth';

const router = Router();

router.param('id', handler.load);

router.use(auth.guard());
router.get('/api/users', handler.index);
router.get('/api/users/:id', handler.show);
router.use(auth.gate('admin'));
router.post('/api/users', schema.store, handler.store);
router.put('/api/users/:id', schema.update, handler.update);
router.delete('/api/users/:id', handler.delete);

export default router;
