import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit('user-joined', { userId: socket.id });
        });

        socket.on('send-message', (data: { roomId: string; content: string; userName: string; type?: string; fileUrl?: string }) => {
            io.to(data.roomId).emit('receive-message', {
                content: data.content,
                userName: data.userName,
                type: data.type || 'text',
                fileUrl: data.fileUrl,
                timestamp: new Date().toISOString(),
            });
        });

        socket.on('draw', (data: { roomId: string; drawingData: any }) => {
            socket.to(data.roomId).emit('draw-data', data.drawingData);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
