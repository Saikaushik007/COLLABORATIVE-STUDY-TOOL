import { Request, Response } from 'express';
import prisma from '../utils/prisma';

interface AuthRequest extends Request {
    user?: { id: string };
}

export const createFlashcardDeck = async (req: AuthRequest, res: Response) => {
    try {
        const { title, roomId, cards } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const deck = await prisma.flashcardDeck.create({
            data: {
                title,
                userId,
                roomId: roomId || null,
                cards: {
                    create: cards.map((card: any) => ({
                        front: card.front,
                        back: card.back,
                    })),
                },
            },
            include: { cards: true },
        });

        res.status(201).json(deck);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getDecksByRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const decks = await prisma.flashcardDeck.findMany({
            where: { roomId },
            include: { cards: true },
        });
        res.json(decks);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createQuiz = async (req: Request, res: Response) => {
    try {
        const { title, roomId, questions } = req.body;
        const quiz = await prisma.quiz.create({
            data: {
                title,
                roomId,
                questions: {
                    create: questions.map((q: any) => ({
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                    })),
                },
            },
            include: { questions: true },
        });
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getQuizzesByRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const quizzes = await prisma.quiz.findMany({
            where: { roomId },
            include: { questions: true },
        });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
