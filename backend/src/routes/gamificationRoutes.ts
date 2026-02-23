import { Router } from 'express';
import { gamificationController } from '../controllers/gamificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, gamificationController.getUserStats);
router.get('/leaderboard', gamificationController.getLeaderboard);

export default router;
