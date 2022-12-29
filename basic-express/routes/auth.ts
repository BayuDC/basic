import { RequestHandler, Router } from 'express';
import { login } from '../handlers/auth';

const router = Router();

router.post('/api/auth/login', login as RequestHandler);

export default router;
