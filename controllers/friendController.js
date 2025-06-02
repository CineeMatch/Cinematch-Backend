import Friend from "../models/friend.js";


export const getAllFriends = async (req, res) => {
    try {
        const friends = await Friend.findAll();
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: "Error fetching friends" });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }
        const friends = await Friend.findAll({
            where: {
                user_id: userId,
                // veya friend_id: userId // isteğe göre ikisini de kontrol edebilirsin
            }
        });

        return res.status(200).json(friends);
    } catch (error) {
        console.error("Get User Friends Error:", error);
        return res.status(500).json({ error: "Failed to fetch user's friends." });
    }
};


//gereksiz olabilir. Friend tablosundaki id deki kayıtı getirmek için kullanılabilir.
// Ancak, kullanıcıların arkadaşlarını almak için yukarıdaki fonksiyon daha mantıklı.
export const getFriendById = async (req, res) => {
    const { id } = req.params;
    try {
        const friend = await Friend.findByPk(id);
        if (friend) {
            res.status(200).json(friend);
        } else {
            res.status(404).json({ message: "Friend not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching friend" });
    }
}

export const createFriend = async (req, res) => {
    try {
        userId = req.user.id;
        const { friendId, status } = req.body;
        if (!userId || !friendId) {
            return res.status(400).json({ message: "userId and friendId are required." });
        }

        if (userId === friendId) {
            return res.status(400).json({ message: "You cannot add yourself as a friend." });
        }

        const validStatuses = ["pending", "accepted", "blocked"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingFriend = await User.findByPk(friendId);
        if (!existingFriend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        const existingFriendship = await Friend.findOne({
            where: {
                user_id: userId,
                friend_id: friendId
            }
        });
        if (existingFriendship) {
            return res.status(400).json({ message: "Friendship already exists." });
        }
        const newFriend = await Friend.create({ user_id: userId, friend_id: friendId, status });
        res.status(201).json(newFriend);
    } catch (error) {
        res.status(500).json({ message: "Error creating friend" });
    }
}

export const deleteFriend = async (req, res) => {
    const { id } = req.params;
    try {
        const existingFriend = await Friend.findByPk(id);
        if (!existingFriend) {
            return res.status(404).json({ message: "Friend not found" });
        }
        await existingFriend.destroy();
        res.status(200).json({ message: "Friend deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting friend" });
    }
}