import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';

export const gainBadge = async (userId, badgeName) => {
    try {
        // Check if the user already has the badge
        const badge = await Badge.findOne({ where: { name: badgeName } });

        // Create a new badge for the user
        const newBadge = await UserBadge.create({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date()
        });

        console.log(`New badge awarded to user ${userId}: ${badgeName}`);
        return newBadge;
    } catch (error) {
        console.error(`Error awarding badge to user ${userId}:`, error);
        throw error;
    }
}