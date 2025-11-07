import express from 'express';
import { ObjectId } from 'mongodb';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Eliminar un juego de la lista de juegos comprados del usuario
router.delete('/:gameId', auth, async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const users = req.db.collection('users');
    
    console.log('Eliminando juego:', gameId);
    console.log('Usuario ID:', req.user.userId);
    
    // Obtener el usuario actual para verificar que tiene el juego
    const user = await users.findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('Juegos del usuario:', user.purchasedGames);

    // Asegurarse de que purchasedGames sea un array
    if (!Array.isArray(user.purchasedGames)) {
      user.purchasedGames = [];
    }

    // Convertir todos los IDs a string para comparación
    const gameIdStr = gameId.toString();
    const hasGame = user.purchasedGames.some(id => id.toString() === gameIdStr);
    
    console.log('¿El juego está en la biblioteca?:', hasGame);

    if (!hasGame) {
      return res.status(404).json({ message: 'Juego no encontrado en la biblioteca del usuario' });
    }

    // Intentar eliminar el juego usando tanto ObjectId como string
    const result = await users.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { 
        $pull: { 
          purchasedGames: {
            $in: [new ObjectId(gameId), gameId]
          }
        } 
      }
    );

    console.log('Resultado de la actualización:', result);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar el juego. No se encontró el juego en la biblioteca.' });
    }

    // Obtener el usuario actualizado
    const updatedUser = await users.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    console.log('Usuario actualizado:', updatedUser);

    res.json({ 
      message: 'Juego eliminado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ 
      message: 'Error del servidor al eliminar el juego', 
      error: error.message,
      stack: error.stack 
    });
  }
});

export default router;