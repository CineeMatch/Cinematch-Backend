import express from 'express';
import sequelize from './configs/database.js';


import challengeRoute from "./routes/challengeRoute.js";
import likeRoute from "./routes/likeRoute.js";
import movieRoute from "./routes/movieRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import recommendationRoute from "./routes/recommendationRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import initStateRoute from "./routes/initStateRoute.js";
import postRoute from "./routes/postRoute.js";
import notificationTypeRoute from './routes/notificationTypeRoute.js';
import cors from 'cors';




const PORT = 5000;
const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/v1",challengeRoute );
app.use("/api/v1",likeRoute );
app.use("/api/v1",movieRoute );
app.use("/api/v1",notificationRoute );
app.use("/api/v1",recommendationRoute );
app.use("/api/v1",userRoute );
app.use("/api/v1",initStateRoute );
app.use("/api/v1",authRoute );
app.use("/api/v1",initStateRoute );



app.use("/api/v1",postRoute);
app.use("/api/v1",notificationTypeRoute);
app.get('/', (req, res) => {
  res.send('Merhaba Node.js Backend!');
});

// Veritabanı senkronizasyonu
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Veritabanı senkronize edildi.');
    app.listen(PORT, () => {
      console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Sequelize senkronizasyon hatası:', err);
  });