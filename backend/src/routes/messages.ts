import { Router } from 'express';
import { getMessages } from '../controllers/messages';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, getMessages);

export default router;
