import { Router } from 'express';
import { getLeaderboard, getUserStats } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/user/:userId', authenticateToken, getUserStats);

export default router;
