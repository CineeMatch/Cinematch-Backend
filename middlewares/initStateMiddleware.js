import dotenv from 'dotenv';
dotenv.config();
import InitState from '../models/initState.js';

const initAuthMiddleware = async (req, res, next) => {
  const secret = req.headers['x-secret-key'];
  const force = req.query.force === 'true';

  if (!secret || secret !== process.env.DB_INIT_SECRET) {
    return res.status(401).json({ message: 'Unauthorized: Invalid secret key.' });
  }

  const initState = await InitState.findByPk(1);

  if (!force && initState?.initialized) {
    return res.status(403).json({ message: 'Database already initialized. Use ?force=true to reinitialize.' });
  }

  req.shouldUpdate = force;
  next();
};

export default initAuthMiddleware;