import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                studyHours: true,
                focusStreak: true,
                achievements: true,
            },
            orderBy: [
                { studyHours: 'desc' },
                { focusStreak: 'desc' }
            ],
            take: 10,
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const stats = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                studyHours: true,
                focusStreak: true,
                achievements: {
                    include: { user: false }
                }
            }
        });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
