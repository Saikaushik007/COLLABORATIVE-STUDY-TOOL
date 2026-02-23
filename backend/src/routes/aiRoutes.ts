import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/chat', authenticateToken, aiController.chat);
router.post('/summarize', authenticateToken, aiController.summarize);
router.post('/generate-quiz', authenticateToken, aiController.generateQuiz);

export default router;
