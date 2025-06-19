import Badge from "../models/badge.js";
import UserBadge from '../models/userBadge.js';

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

        return newBadge;
    } catch (error) {
        console.error(`Error awarding badge to user ${userId}:`, error);
        throw error;
    }
}