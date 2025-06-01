import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import  capitalizeWords  from '../utils/wordCapitalizer.js';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET 

export const register = async (req, res) => {
  const { email, password, name, surname, nickname } = req.body;

  try {
const existingUser = await User.findOne({
          where: {
            [Op.or]: [
              { email: email },
              { nickname: nickname}
            ]
          }
        });    if (existingUser) return res.status(400).json({ message: 'This email or nickname is already used by another user.' });


    const newUser = await User.create({
      email,
      password,
      name: capitalizeWords(name),
      surname: capitalizeWords(surname),
      nickname,
    });

    return res.status(201).json({ message: 'User created succesfully.', user: { id: newUser.id, email: newUser.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Couldn\'t find user with this email.' });
    console.log("user :", user);
   const isMatch = await user.comparePassword(password);
   if (!isMatch) return res.status(401).json({ message: 'Password is wrong.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
console.log("token :", token);
    return res.json({ message: 'Loged in successfully', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
