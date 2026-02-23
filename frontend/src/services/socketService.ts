import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;

    connect() {
        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return this.socket;
    }

    getSocket() {
        return this.socket;
    }

    disconnect() {
        this.socket?.disconnect();
    }

    joinRoom(roomId: string) {
        this.socket?.emit('join-room', roomId);
    }

    sendMessage(roomId: string, content: string, userName: string, type: string = 'text', fileUrl?: string) {
        this.socket?.emit('send-message', { roomId, content, userName, type, fileUrl });
    }

    onReceiveMessage(callback: (data: any) => void) {
        this.socket?.on('receive-message', callback);
    }

    onUserJoined(callback: (data: any) => void) {
        this.socket?.on('user-joined', callback);
    }

    sendDrawData(roomId: string, drawingData: any) {
        this.socket?.emit('draw', { roomId, drawingData });
    }

    onReceiveDrawData(callback: (data: any) => void) {
        this.socket?.on('draw-data', callback);
    }
}

export const socketService = new SocketService();
