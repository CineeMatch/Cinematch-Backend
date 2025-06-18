import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import  capitalizeWords  from '../utils/wordCapitalizer.js';
import sendMail from '../utils/mailSender.js';
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
    res.status(500).json({ message: `Something went wrong, ${err.message}`});
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Couldn\'t find user with this email.' });
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

export const forgetPassword = async(req,res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email }});
    if (!user) {
     res.status(404).json({message:"Cannot find an user with this email."})
      
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user.id}`;

    const emailContent = `
      <p>Merhaba ${user.name},</p>
      <p>Sifre sifirlama talebinde bulundunuz. Sifrenizi sifirlamak icin asagidaki baglantiya tiklayin:</p>
      <a href="${resetLink}">Sifremi Sifirla</a>
      <p>Bu talebi siz yapmadiysaniz, lutfen bize ulasiniz</p>
    `;

    await sendMail(user.email, 'Sifre Sifirlama Talebi', emailContent);

   return res.status(200).json({ message: 'Email reset link was sent!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Something went wrong.",error});
  }
};

export const resetPassword = async(req,res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId)
    if (!user) {
     return  res.status(404).json({message:"Cannot find this user."})
    }
       const isMatch = await user.comparePassword(newPassword);
      if(isMatch) return res.status(400).json({message:"Cannnot use old password."})
    
   await User.update({password:newPassword},{where: { id: userId },
      individualHooks: true} );

    res.status(200).json({ message: 'Password was reset succesfully!' });
  } catch (error) {
    console.log(error);
       return  res.status(500).json({message: `Error while resetting password: ${error.message}`});

  }
};