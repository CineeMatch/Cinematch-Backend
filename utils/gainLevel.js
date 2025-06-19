import User from '../models/user.js';

export const gainLevel = async (userId, type) => {
    try {
        let point = 0;
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        if (type !== 'comment' && type !== 'post' && type !== 'watch' && type !== 'challange') {
            throw new Error('Invalid type for gaining level. Must be "comment", "post", or "like".');
        }

        if (type === 'comment') {
            point += 10;
        } else if (type === 'post') {
            point += 20;
        } else if (type === 'watch') {
            point += 25;
        } else if (type === 'challange') {
            point += 15;
        }

        const level = Math.floor(point / 100) + 1;

        await User.update({ level }, { where: { id: userId } });

        return level;
    } catch (error) {
        console.error(`Error leveling up user ${userId}:`, error);
        throw error;
    }
}