import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret', async (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        // Verify user still exists in database (crucial after DB reset)
        const userExists = await prisma.user.findUnique({ where: { id: user.id } });
        if (!userExists) {
            return res.status(401).json({ message: 'User no longer exists. Please re-register.' });
        }

        req.user = user;
        next();
    });
};
