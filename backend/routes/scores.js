import express from 'express';
import { ObjectId } from 'mongodb';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Obtener top 10 scores de un juego
router.get('/top/:gameId', async (req, res) => {
  try {
    const scores = req.db.collection('scores');
    const topScores = await scores.aggregate([
      { $match: { gameId: req.params.gameId } },
      { $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
          user: {
            name: '$user.name',
            _id: '$user._id'
          },
          score: 1,
          date: 1,
          gameId: 1
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    res.json(topScores);
  } catch (error) {
    console.error('Get top scores error:', error);
    res.status(500).json({ message: 'Error al obtener scores' });
  }
});

// Enviar score
router.post('/', auth, async (req, res) => {
  try {
    const { gameId, score } = req.body;

    if (!gameId || score === undefined) {
      return res.status(400).json({ message: 'ID del juego y score son requeridos' });
    }

    // Verificar que el usuario tenga el juego
    const users = req.db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!user.purchasedGames.includes(gameId)) {
      return res.status(400).json({ message: 'No tienes este juego' });
    }

    const scores = req.db.collection('scores');
    
    const newScore = {
      userId: new ObjectId(req.user.userId),
      gameId,
      score: parseInt(score),
      date: new Date()
    };

    const result = await scores.insertOne(newScore);
    newScore._id = result.insertedId;
    
    // Populate user name
    newScore.user = { name: user.name };
    
    res.status(201).json(newScore);
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(400).json({ message: 'Error al guardar score' });
  }
});

export default router;