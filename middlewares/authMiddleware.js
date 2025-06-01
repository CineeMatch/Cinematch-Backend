import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token missing' });

    console.log("token :", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Sequelize için doğru sorgu
    const user = await User.findOne({
      where: { id: decoded.id }
    });

    console.log("user :", user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.token = token;
    req.user = user;
    console.log("req.user on middleware :", req.user);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export default authMiddleware;
