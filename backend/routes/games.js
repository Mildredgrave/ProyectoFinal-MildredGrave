import express from "express";
import { ObjectId } from 'mongodb';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Ruta para obtener los juegos
router.get("/", async (req, res) => {
  try {
    const games = await req.db.collection("games").find().toArray();
    res.json(games);
  } catch (error) {
    console.error(" Error al obtener los juegos:", error);
    res.status(500).json({ error: "Error al obtener los juegos" });
  }
});

// Crear nuevo juego (solo admin)
router.post("/", auth, async (req, res) => {
  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    const { name, description, price, category, isFree, icon } = req.body;
    
    if (!name || !description || !category || !icon) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const newGame = {
      name,
      description,
      price: isFree ? 0 : price,
      category,
      isFree: Boolean(isFree),
      iconUrl: icon,
      createdAt: new Date()
    };

    const games = req.db.collection('games');
    const result = await games.insertOne(newGame);
    
    res.status(201).json({
      _id: result.insertedId,
      ...newGame
    });
  } catch (error) {
    console.error('Error al crear juego:', error);
    res.status(500).json({ message: 'Error al crear el juego' });
  }
});

// Actualizar juego (solo admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    const games = req.db.collection('games');
    const result = await games.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error al actualizar juego:', error);
    res.status(500).json({ message: 'Error al actualizar el juego' });
  }
});

// Eliminar juego (solo admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.user.userId) });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    const games = req.db.collection('games');
    const result = await games.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    res.status(500).json({ message: 'Error al eliminar el juego' });
  }
});

export default router;
