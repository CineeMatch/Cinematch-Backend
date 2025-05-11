import { Server } from 'socket.io';
import messageSocketHandler from './message.js';

export let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000', // React çalıştığı portu yazabilirsin
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('Yeni bağlantı:', socket.id, `, ${new Date().toLocaleString()}`);

        // Olayları ayrı dosyaya delegasyon
        messageSocketHandler(io, socket);

        socket.on('disconnect', () => {
            console.log('Socket ayrıldı:', socket.id, `, ${new Date().toLocaleString()}`);
        });
    });
};
