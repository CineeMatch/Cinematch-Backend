import User from "../models/user";
import { Op } from "sequelize";


export const getUsers = async (req, res) => {
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
  const id=req.user.id;
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
    const { email, password,name,surname,nickname } = req.body;
    if (!email || !password || !name||!surname||!nickname) {
      return res.status(400).json({ error: "Required fields are missing." });
    }
    const user = await User.findOne({
          where: {
            [Op.or]: [
              { email: email },
              { nickname: nickname}
            ]
          }
        });
    if (user) {
      return res.status(409).json({ error: "This User already exists." });
    }

    const newUser = await User.create(req.body);
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
      where: { id: userId }
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
