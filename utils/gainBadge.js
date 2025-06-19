import Badge from "../models/badge.js";
import UserBadge from '../models/UserBadge.js';

export const gainBadge = async (userId, badgeName) => {
    try {
        console.log(`Attempting to award badge "${badgeName}" to user with ID ${userId}`);
        // Check if the user already has the badge
        const badge = await Badge.findOne({ where: { name: badgeName } });
        console.log(`Badge found: ${badge.id}`);
        // Create a new badge for the user
        const newBadge = await UserBadge.create({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date()
        });
        console.log(`New badge created: ${newBadge}`);

        console.log(`New badge awarded to user ${userId}: ${badgeName}`);
        return newBadge;
    } catch (error) {
        console.error(`Error awarding badge to user ${userId}:`, error);
        throw error;
    }
}