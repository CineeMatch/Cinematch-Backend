export default function messageSocketHandler(io, socket) {
    socket.on('joinChat', ({ user1, user2 }) => {
        const chatId = [user1, user2].sort().join('_');
        socket.join(chatId);
    });

    socket.on('sendMessage', ({ from, to, text }) => {
        const chatId = [from, to].sort().join('_');
        io.to(chatId).emit('receiveMessage', { from, to, text, time: Date.now() });
        console.log(`Message from ${from} to ${to}: ${text}`);
    });
}
