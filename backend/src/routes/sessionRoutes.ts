import { Router } from 'express';
import {
    scheduleSession,
    getScheduledSessions,
    getGlobalSessions,
    deleteScheduledSession
} from '../controllers/sessionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, scheduleSession);
router.get('/global', getGlobalSessions);
router.get('/room/:roomId', getScheduledSessions);
router.delete('/:id', authenticateToken, deleteScheduledSession);

export default router;
