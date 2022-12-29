import { Router } from 'express';
import handler from '../handlers/main';

const router = Router();

router.get('/', handler.web);
router.get('/api', handler.api);

export default router;
