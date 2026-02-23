import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const scheduleSession = async (req: any, res: Response) => {
    try {
        const { title, description, startTime, endTime, roomId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let targetRoomId = roomId;

        // Automation: If no roomId provided, create a new room for this session
        if (!targetRoomId) {
            console.log("AI_AUTOMATION: Creating associated room for session...");
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const room = await prisma.room.create({
                data: {
                    name: title,
                    description: description || `Automatic room for session: ${title}`,
                    code: roomCode,
                    type: 'PUBLIC',
                    category: 'Study Session',
                    members: {
                        create: {
                            userId,
                            role: 'ADMIN',
                        },
                    },
                },
            });
            targetRoomId = room.id;
        }

        const session = await prisma.scheduledSession.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                roomId: targetRoomId,
                creatorId: userId,
            },
            include: {
                room: { select: { code: true } }
            }
        });

        console.log("SESSION_SCHEDULED_SUCCESS:", session.id, "Associated Room Code:", session.room.code);
        res.status(201).json(session);
    } catch (error: any) {
        console.error("SESSION_SCHEDULE_ERROR:", error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

export const getScheduledSessions = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const sessions = await prisma.scheduledSession.findMany({
            where: { roomId: roomId.toString() },
            include: { room: { select: { name: true } } },
            orderBy: { startTime: 'asc' },
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGlobalSessions = async (req: Request, res: Response) => {
    try {
        // Show everything from 12 hours ago (to see active/recent) to future
        const twelveHoursAgo = new Date();
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

        const sessions = await prisma.scheduledSession.findMany({
            where: { startTime: { gte: twelveHoursAgo } },
            include: {
                room: { select: { name: true, category: true, code: true } },
                creator: { select: { name: true, image: true } }
            },
            orderBy: { startTime: 'asc' },
            take: 50
        });
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteScheduledSession = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.scheduledSession.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
