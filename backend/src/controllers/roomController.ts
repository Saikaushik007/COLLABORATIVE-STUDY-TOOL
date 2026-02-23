import { Response } from 'express';
import { Request } from 'express';
import prisma from '../utils/prisma';

interface AuthRequest extends Request {
    user?: { id: string };
}

export const createRoom = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, type, category } = req.body;
        const userId = req.user?.id;

        console.log("CREATE_ROOM_INPUT:", { name, type, category, userId });

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!name) {
            return res.status(400).json({ message: 'Room name is required' });
        }

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = await prisma.room.create({
            data: {
                name,
                description,
                category: category || 'General',
                type: type || 'PUBLIC',
                code,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN',
                    },
                },
            },
        });

        console.log("ROOM_CREATED_SUCCESS:", room.code);
        res.status(201).json(room);
    } catch (error: any) {
        console.error("ROOM_CREATE_ERROR:", error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany({
            where: { type: 'PUBLIC' },
            include: {
                _count: {
                    select: { members: true },
                },
            },
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRoomByCode = async (req: Request, res: Response) => {
    try {
        const code = req.params.code as string;
        const room = await prisma.room.findUnique({
            where: { code },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                },
                _count: {
                    select: { members: true },
                },
                scheduled: true,
            },
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Simplify member structure for frontend
        const simplifiedRoom = {
            ...room,
            members: (room as any).members.map((m: any) => ({
                ...m.user,
                role: m.role
            }))
        };

        res.json(simplifiedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const room = await prisma.room.findUnique({
            where: { code },
        });

        if (!room) return res.status(404).json({ message: 'Room not found' });

        const membership = await prisma.roomMember.upsert({
            where: {
                userId_roomId: {
                    userId,
                    roomId: room.id,
                },
            },
            update: {}, // Don't change role if already a member
            create: {
                userId,
                roomId: room.id,
                role: 'MEMBER',
            },
        });

        // Award points for joining a room
        const { gamificationController } = require('./gamificationController');
        await gamificationController.awardPoints(userId, 10, "Joined a Study Lab");

        res.json({ message: 'Joined successfully', roomCode: room.code });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const kickMember = async (req: AuthRequest, res: Response) => {
    try {
        const { roomId, userId } = req.body;
        const requesterId = req.user?.id;

        if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });

        // Check if requester is admin/moderator
        const requester = await prisma.roomMember.findUnique({
            where: { userId_roomId: { userId: requesterId, roomId } }
        });

        if (!requester || (requester.role !== 'ADMIN' && requester.role !== 'MODERATOR')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.roomMember.delete({
            where: { userId_roomId: { userId, roomId } }
        });

        res.json({ message: 'Member kicked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateMemberRole = async (req: AuthRequest, res: Response) => {
    try {
        const { roomId, userId, role } = req.body;
        const requesterId = req.user?.id;

        if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });

        // Check if requester is an admin in the room
        const requester = await prisma.roomMember.findUnique({
            where: { userId_roomId: { userId: requesterId, roomId } }
        });

        if (!requester || requester.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Only admins can change roles' });
        }

        const updatedMember = await prisma.roomMember.update({
            where: { userId_roomId: { userId, roomId } },
            data: { role }
        });

        res.json({ message: 'Role updated successfully', member: updatedMember });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
