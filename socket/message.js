import Conversation from '../models/conversation.js';

export default function messageSocketHandler(io, socket) {
    socket.on('joinChat', ({ user1, user2 }) => {
        const chatId = [user1, user2].sort().join('_');
        socket.join(chatId);
        console.log(`${socket.id} joined room: ${chatId}`);
    });


    socket.on('sendMessage', async ({ from, to, text }) => {
        const senderId = parseInt(from);
        const receiverId = parseInt(to);

        if (isNaN(senderId) || isNaN(receiverId)) {
            console.error('Geçersiz ID:', { from, to });
            return;
        }

        const chatId = [senderId, receiverId].sort().join('_');

        await Conversation.create({
            conversation_id: chatId,
            sender_id: senderId,
            receiver_id: receiverId,
            content: text,
            sent_at: new Date(),
            is_read: false
        });

        io.to(chatId).emit('receiveMessage', {
            from: senderId,
            to: receiverId,
            text,
            time: Date.now()
        });
    });


}
