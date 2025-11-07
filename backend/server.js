import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToMongo } from './configs/mongodb.config.js';
import { ObjectId } from 'mongodb';
import { dbMiddleware } from './middleware/db.js';
import indexRoutes from './routes/index.route.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import cartRoutes from './routes/cart.js';
import scoresRoutes from './routes/scores.js';
import purchasesRoutes from './routes/purchases.js';
import userGamesRoutes from './routes/user-games.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


await connectToMongo();


app.use(dbMiddleware);


app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/user-games', userGamesRoutes);


export { ObjectId };

const startServer = async () => {
  try {
    await connectToMongo();
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
