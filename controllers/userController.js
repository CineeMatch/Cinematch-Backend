import User from "../models/user.js";
import { Op } from "sequelize";
import cloudinary from "../configs/cloudinary.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'User cannot be found.' });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: `User doesn't exist.` });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'User cannot be found.' });
  }
};

export const getActiveUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findByPk(id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: `User doesn't exist.` });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'User cannot be found.' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, name, surname, nickname } = req.body;
    if (!email || !password || !name || !surname || !nickname) {
      return res.status(400).json({ error: "Required fields are missing." });
    }
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { nickname: nickname }
        ]
      }
    });
    if (user) {
      return res.status(409).json({ error: "This User already exists." });
    }

    const newUser = await User.create({ name: capitalizeWords(req.body.name), surname: capitalizeWords(req.body.surname), ...req.body });
    return res.status(201).json({ message: "New user created successfully!", user: newUser });
  } catch (error) {
    console.error('Create Error:', error);
    return res.status(500).json({ error: 'User could not be created.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.destroy({
      where: { id: req.params.id }
    });

    if (user) {
      return res.status(200).json({ message: "User deleted successfully." });
    } else {
      return res.status(404).json({ message: "This user doesn't exist." });
    }
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ error: 'User could not be deleted.' });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.update(updateData, {
      where: { id: userId },
      individualHooks: true
    });

    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: "User not found or not updated." });
    }

    const user = await User.findByPk(userId);
    return res.status(200).json({ message: "User updated successfully.", user });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "User could not be updated." });
  }
};

export const updateActiveUser = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.update(updateData, {
      where: { id: userId },
      individualHooks: true

    });

    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: "User not found or not updated." });
    }

    const user = await User.findByPk(userId);
    return res.status(200).json({ message: "User updated successfully.", user });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "User could not be updated." });
  }
};

export const uploadUserAvatar = async (req, res) => {
  const userId = req.user.id;
  const base64Image = req.body.url;
  try {
    const cloudinaryResult = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "MR-WA-Avatar",
      resource_type: "auto",
    });

    const updatedUser = await User.update({ profile_image_url: cloudinaryResult.secure_url, profile_image_public_id: cloudinaryResult.public_id }, {
      where: { id: userId },
      individualHooks: true
    })
    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: "User not found or not updated." });
    }
 
    return res.status(200).json({
      message: "User profile updated successfully.",
      avatarUrl: cloudinaryResult.secure_url // bu kısmı döndür
    });


  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "User could not be updated." });
  }
}
