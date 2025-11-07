import express from 'express';
import { ObjectId } from 'mongodb';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Helper para buscar el carrito soportando userId como string u ObjectId
const findCartByUser = async (cartsCollection, userIdStr) => {
  let cart = await cartsCollection.findOne({ userId: userIdStr });
  if (!cart) {
    // Intenta con ObjectId si la búsqueda por string no devolvió nada
    try {
      cart = await cartsCollection.findOne({ userId: new ObjectId(userIdStr) });
    } catch (e) {
      // Ignorar error de ObjectId inválido
    }
  }
  return cart;
};

// Obtener carrito del usuario
router.get('/', auth, async (req, res) => {
  try {
    const carts = req.db.collection('carts');
    const userIdStr = req.user.userId;

    let cart = await findCartByUser(carts, userIdStr);

    if (!cart) {
      cart = { userId: userIdStr, items: [], updatedAt: new Date() };
      await carts.insertOne(cart);
    }

    // Populate games info
    if (cart.items.length > 0) {
      const games = req.db.collection('games');
      const gameIds = cart.items.map(item => new ObjectId(item.gameId));
      const gamesData = await games.find({ _id: { $in: gameIds } }).toArray();

      cart.items = cart.items.map(item => {
        const game = gamesData.find(g => g._id.toString() === item.gameId.toString());
        return { ...item, game };
      });
    }

    res.json(cart.items);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error al obtener carrito' });
  }
});

// Agregar item al carrito
router.post('/', auth, async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: 'ID del juego es requerido' });
    }

    const games = req.db.collection('games');
    const game = await games.findOne({ _id: new ObjectId(gameId) });

    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    if (game.isFree) {
      return res.status(400).json({ message: 'No se puede agregar juegos gratuitos al carrito' });
    }

    const carts = req.db.collection('carts');
    const userIdStr = req.user.userId;

    let cart = await findCartByUser(carts, userIdStr);

    if (!cart) {
      cart = { userId: userIdStr, items: [], updatedAt: new Date() };
      await carts.insertOne(cart);
    }

    // Buscar existente soportando diferencias de tipo
    const existingItem = cart.items.find(item => item.gameId === gameId || item.gameId === gameId.toString());

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ gameId: gameId.toString(), quantity: 1 });
    }

    cart.updatedAt = new Date();
    await carts.updateOne(
      { $or: [{ userId: userIdStr }, { userId: new ObjectId(userIdStr) }] },
      { $set: { items: cart.items, updatedAt: cart.updatedAt } },
      { upsert: true }
    );

    res.json(cart.items);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(400).json({ message: 'Error al agregar al carrito' });
  }
});

// Eliminar item del carrito
router.delete('/:gameId', auth, async (req, res) => {
  try {
    const carts = req.db.collection('carts');
    const userIdStr = req.user.userId;
    let cart = await findCartByUser(carts, userIdStr);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(item => item.gameId !== req.params.gameId && item.gameId !== req.params.gameId.toString());
    cart.updatedAt = new Date();

    await carts.updateOne(
      { $or: [{ userId: userIdStr }, { userId: new ObjectId(userIdStr) }] },
      { $set: { items: cart.items, updatedAt: cart.updatedAt } }
    );

    res.json(cart.items);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
});

// Vaciar carrito
router.delete('/', auth, async (req, res) => {
  try {
    const carts = req.db.collection('carts');
    const userIdStr = req.user.userId;
    
    await carts.updateOne(
      { $or: [{ userId: userIdStr }, { userId: new ObjectId(userIdStr) }] },
      { $set: { items: [], updatedAt: new Date() } }
    );

    res.json([]);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
});

// Procesar compra
router.post('/checkout', auth, async (req, res) => {
  try {
    const carts = req.db.collection('carts');
    const userIdStr = req.user.userId;
    const cart = await findCartByUser(carts, userIdStr);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Carrito vacío' });
    }

    const users = req.db.collection('users');
    const purchasedGames = cart.items.map(item => item.gameId);

    // Agregar juegos al usuario
    await users.updateOne(
      { _id: new ObjectId(userIdStr) },
      { $addToSet: { purchasedGames: { $each: purchasedGames } } }
    );

    // Vaciar carrito
    await carts.updateOne(
      { $or: [{ userId: userIdStr }, { userId: new ObjectId(userIdStr) }] },
      { $set: { items: [], updatedAt: new Date() } }
    );

    res.json({ 
      message: 'Compra realizada exitosamente', 
      purchasedGames 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Error al procesar compra' });
  }
});

export default router;