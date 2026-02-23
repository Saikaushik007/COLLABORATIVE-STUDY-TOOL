import { Router } from 'express';
import { createRoom, getRooms, getRoomByCode, joinRoom, kickMember, updateMemberRole } from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createRoom);
router.get('/', getRooms);
router.get('/:code', getRoomByCode);
router.post('/join', authenticateToken, joinRoom);
router.post('/kick', authenticateToken, kickMember);
router.patch('/role', authenticateToken, updateMemberRole);

export default router;
