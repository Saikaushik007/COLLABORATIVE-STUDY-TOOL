import { Router } from 'express';
import {
    createFlashcardDeck,
    getDecksByRoom,
    createQuiz,
    getQuizzesByRoom
} from '../controllers/contentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/flashcards', authenticateToken, createFlashcardDeck);
router.get('/flashcards/room/:roomId', getDecksByRoom);

router.post('/quizzes', authenticateToken, createQuiz);
router.get('/quizzes/room/:roomId', getQuizzesByRoom);

export default router;
