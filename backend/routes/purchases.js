import express from 'express';
import { ObjectId } from 'mongodb';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Agregar un juego gratuito a la lista de purchasedGames del usuario
router.post('/', auth, async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) {
      return res.status(400).json({ message: 'ID del juego es requerido' });
    }

    const db = req.db;
    const games = db.collection('games');
    const users = db.collection('users');

    const game = await games.findOne({ _id: new ObjectId(gameId) });
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Solo permitir añadir al usuario si el juego es gratuito
    if (!game.isFree) {
      return res.status(400).json({ message: 'Solo se pueden agregar juegos gratuitos con este endpoint' });
    }

    await users.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $addToSet: { purchasedGames: gameId.toString() } }
    );

    res.json({ message: 'Juego agregado a tu biblioteca', gameId });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Error al agregar juego a la biblioteca' });
  }
});

export default router;
