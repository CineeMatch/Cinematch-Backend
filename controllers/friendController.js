import Friend from "../models/friend.js";
import User from "../models/user.js";
import { createNotification } from "./notificationController.js";
import { Op } from "sequelize";

export const getAllFriends = async (req, res) => {
  try {
    const friends = await Friend.findAll({
      include: [
        { model: User, as: "initiator" },
        { model: User, as: "receiver" },
      ],
    });
    res.status(200).json(friends);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching friends ${error.message}` });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const userId = req.user.id;

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
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "receiver",
        },
      ],
    });

    const result = friends.map((friend) => friend.receiver); // direkt User objesi

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get User Friends Error:", error);
    return res.status(500).json({
      error: `Failed to fetch user's friends: ${error.message}`,
    });
  }
};

export const getFriendById = async (req, res) => {
  const { id } = req.params;
  try {
    const friend = await Friend.findByPk(id, {
      include: [
        {
          model: User,
          as: "initiator",
        },
      ],
    });
    if (friend) {
      res.status(200).json(friend);
    } else {
      res.status(404).json({ message: "Friend not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend" });
  }
};

export const createFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from token:", userId);
    const { friend_id } = req.body;
    console.log("Friend ID from request body:", friend_id);
    if (!userId || !friend_id) {
      return res
        .status(400)
        .json({ message: "userId and friendId are required." });
    }

    if (userId === friend_id) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingFriend = await User.findByPk(friend_id);
    if (!existingFriend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    const existingFriendship = await Friend.findOne({
      where: {
        user_id: userId,
        friend_id: friend_id,
      },
    });
    if (existingFriendship) {
      return res.status(400).json({ message: "Friendship already exists." });
    }
    const newFriend = await Friend.create({
      user_id: userId,
      friend_id: friend_id,
      status: "pending",
    });

    const type_id = 1;
    req.body = { reciver_id: friendId, type_id };

    const notification = {
      status: (code) => ({
        json: (data) => console.log(`[Notification Response] ${code}:`, data),
      }),
    };

    await createNotification(req, notification);
    res
      .status(201)
      .json({ message: "Friend request created", friendRequest: newFriend });
  } catch (error) {
    console.error("Create Friend Error:", error);
    res
      .status(500)
      .json({ message: `Error creating friend ${error.message} ` });
  }
};

export const createFriendForNickname = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname } = req.body;

    console.log("User ID from token:", userId);
    console.log("Friend nickname from request body:", nickname);

    if (!userId || !nickname) {
      return res
        .status(400)
        .json({ message: "User ID and nickname are required." });
    }

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendUser = await User.findOne({
      where: { nickname },
    });

    if (!friendUser) {
      return res
        .status(404)
        .json({ message: "Friend not found with this nickname." });
    }

    const friendId = friendUser.id;

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    const existingFriendship = await Friend.findOne({
      where: {
        user_id: userId,
        friend_id: friendId,
      },
    });

    if (existingFriendship) {
      return res.status(400).json({ message: "Friendship already exists." });
    }

    const newFriend = await Friend.create({
      user_id: userId,
      friend_id: friendId,
      status: "pending",
    });

    // const existingNotification = await Notification.findOne({
    //   where: {
    //     sender_id: userId,
    //     reciver_id: friendId,
    //     type_id,
    //   },
    // });

    // if (!existingNotification) {
    //   await Notification.create({
    //     sender_id: userId,
    //     reciver_id: friendId,
    //     type_id,
    //     isRead: false,
    //   });
    // }
    const type_id = 1;
    req.body = { reciver_id: friendId, type_id };

    const notification = {
      status: (code) => ({
        json: (data) => console.log(`[Notification Response] ${code}:`, data),
      }),
    };

    await createNotification(req, notification);
    res
      .status(201)
      .json({ message: "Friend request created", friendRequest: newFriend });

    return res.status(201).json({
      message: "Friend request sent successfully.",
      friend: newFriend,
    });
  } catch (error) {
    console.error("Create Friend Error:", error);
    res
      .status(500)
      .json({ message: `Error creating friend: ${error.message}` });
  }
};

export const deleteFriend = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user.id;

  try {
    // İki yönlü arkadaşlığı kontrol et
    const friendships = await Friend.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, friend_id: friendId },
          { user_id: friendId, friend_id: userId },
        ],
      },
    });

    if (!friendships || friendships.length === 0) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Tüm bulunan kayıtları sil
    for (const friendship of friendships) {
      await friendship.destroy();
    }

    return res.status(200).json({ message: "Friend deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting friend: ${error.message}` });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const friendId = req.body.friendId;
    console.log("Friend ID from request body:", friendId);
    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const friendship = await Friend.findOne({
      where: {
        user_id: friendId, // Gönderen
        friend_id: userId, // Kabul eden
        status: "pending",
      },
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (friendship.friend_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only accept friend requests sent to you." });
    }

    if (friendship.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Friend request is not pending." });
    }

    friendship.status = "accepted";
    await friendship.save();

    const reverseFriendship = await Friend.findOne({
      where: {
        user_id: friendship.friend_id,
        friend_id: friendship.user_id,
      },
    });

    if (!reverseFriendship) {
      await Friend.create({
        user_id: friendship.friend_id,
        friend_id: friendship.user_id,
        status: "accepted",
      });
    }

    res.status(200).json({
      message: "Friend request accepted and mutual friendship created.",
    });
  } catch (error) {
    console.error("Accept Friend Request Error:", error);
    res.status(500).json({ message: "Failed to accept friend request." });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    const friendship = await Friend.findOne({
      where: {
        user_id: friendId, // isteği gönderen
        friend_id: userId, // alan
        status: "pending",
      },
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (friendship.friend_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only reject friend requests sent to you." });
    }

    if (friendship.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be rejected." });
    }

    await friendship.destroy();

    res.status(200).json({ message: "Friend request rejected and removed." });
  } catch (error) {
    console.error("Reject Friend Request Error:", error);
    res.status(500).json({ message: "Failed to reject friend request." });
  }
};

export const getFriendRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const friendRequests = await Friend.findAll({
      where: {
        friend_id: userId,
        status: "pending",
      },
    });
    res.json(friendRequests);
  } catch (error) {
    console.error("Get Friend Requests Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch friend requests." });
  }
};