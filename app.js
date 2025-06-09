import express from 'express';
import sequelize from './configs/database.js';
import "./models/index.js";
import defineAssociations from './configs/associations.js';
import cors from 'cors';
import http from 'http';
import { initSocket } from './socket/index.js';
import InitState from './models/initState.js';
import { getAllMoviesForDb } from './controllers/initStateController.js';

import movieTypeRoute from './routes/movieTypeRoute.js';
import coMatchSuggestionRoute from './routes/coMatchSuggestionRoute.js';
import postRoute from './routes/postRoute.js';
import friendRoute from './routes/friendRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import commentLikeRoute from './routes/commentLikeRoute.js';
import movieCategoryRoute from './routes/movieCategoryRoute.js';
import notificationTypeRoute from './routes/notificationTypeRoute.js';
import userBadgeRoute from './routes/userBadgeRoute.js';
import commentRoute from './routes/commentRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import challengeQuestionRoute from './routes/challengeQuestionRoute.js';
import badgeRoute from './routes/badgeRoute.js';
import globalConfig from './configs/globalConfig.js';
import challengeRoute from './routes/challengeRoute.js';
import likeRoute from './routes/likeRoute.js';
import movieRoute from './routes/movieRoute.js';
import notificationRoute from './routes/notificationRoute.js';
import recommendationRoute from './routes/recommendationRoute.js';
import userRoute from './routes/userRoute.js';
import initStateRoute from './routes/initStateRoute.js';
import authRoute from './routes/authRoute.js';

const app = express();

// Import all models to ensure they are registered with Sequelize
defineAssociations();

const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api/v1", movieTypeRoute);
app.use("/api/v1", coMatchSuggestionRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", friendRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", commentLikeRoute);
app.use('/api/v1', movieCategoryRoute);
app.use('/api/v1', notificationTypeRoute);
app.use('/api/v1', userBadgeRoute);
app.use('/api/v1', commentRoute);
app.use('/api/v1', conversationRoute);
app.use('/api/v1', challengeQuestionRoute);
app.use('/api/v1', badgeRoute);
app.use("/api/v1", challengeRoute);
app.use("/api/v1", likeRoute);
app.use("/api/v1", movieRoute);
app.use("/api/v1", notificationRoute);
app.use("/api/v1", recommendationRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", initStateRoute);
app.use("/api/v1", authRoute);

const port = globalConfig.port || 5000;

sequelize.sync()
  .then(async () => {
    console.log('Database synchronized.');

    const [init, created] = await InitState.findOrCreate({
      where: { id: 1 },
      defaults: { initialized: false }
    });

    if (!init.initialized) {
      console.log('Fetching movie data from TMDB...');

      await getAllMoviesForDb(
        { shouldUpdate: false },
        {
          status: () => ({ json: () => {} })
        }
      );
    } else {
      console.log('Movie data already initialized. Skipping import.');
    }

    server.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error during Sequelize sync:', err);
  });