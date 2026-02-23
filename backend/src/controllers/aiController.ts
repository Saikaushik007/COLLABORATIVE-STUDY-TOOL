import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { PrismaClient } from '@prisma/client';
import { gamificationController } from './gamificationController';

const prisma = new PrismaClient();

export const aiController = {
    async chat(req: any, res: Response) {
        try {
            const { prompt, roomId } = req.body;
            const userId = req.user?.id;

            // Gather room context if provided
            let context = "";
            if (roomId) {
                const messages = await prisma.message.findMany({
                    where: { roomId },
                    take: 20,
                    orderBy: { createdAt: 'desc' }
                });
                context = messages.map(m => m.content).join(" ");
            }

            const response = await aiService.generateResponse(prompt, context);

            // Award points for using AI Chat
            if (userId) {
                await gamificationController.awardPoints(userId, 5, "Used AI Assistant");
            }

            res.json({ response });
        } catch (error: any) {
            console.error("AI_CHAT_ERROR:", error);
            res.status(500).json({ error: error.message });
        }
    },

    async summarize(req: any, res: Response) {
        try {
            const { roomId } = req.body;
            const userId = req.user?.id;
            if (!roomId) return res.status(400).json({ error: "Room ID required" });

            // Elite Permission Check
            const member = await prisma.roomMember.findUnique({
                where: { userId_roomId: { userId, roomId } }
            });

            if (!member) {
                return res.status(403).json({ error: "Only room members can synthesize session intel." });
            }

            const messages = await prisma.message.findMany({
                where: { roomId },
                take: 100,
                orderBy: { createdAt: 'desc' }
            });

            if (messages.length === 0) {
                return res.json({ summary: "No enough data to summarize yet. Start studying!" });
            }

            const summary = await aiService.summarizeSession(messages.reverse());

            // Award points for session summary
            if (userId) {
                await gamificationController.awardPoints(userId, 20, "Synthesized Session Hub");
            }

            res.json({ summary });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    async generateQuiz(req: any, res: Response) {
        try {
            const { roomId } = req.body;
            const userId = req.user?.id;
            if (!roomId) return res.status(400).json({ error: "Room ID required" });

            // Elite Permission Check
            const member = await prisma.roomMember.findUnique({
                where: { userId_roomId: { userId, roomId } }
            });

            if (!member) {
                return res.status(403).json({ error: "Only room members can generate assessments." });
            }

            const messages = await prisma.message.findMany({
                where: { roomId },
                take: 50,
                orderBy: { createdAt: 'desc' }
            });

            const context = messages.map(m => m.content).join(" ");
            const questions = await aiService.generateQuiz(context);

            // Award points for generating a quiz
            if (userId) {
                await gamificationController.awardPoints(userId, 30, "Generated Knowledge Assessment");
            }

            res.json({ questions });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};
