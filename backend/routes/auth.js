import express from 'express';
import { SignJWT } from 'jose';
import { ObjectId } from 'mongodb';
import { auth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';


const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const users = req.db.collection('users');
    
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      email,
      name,
      password: hashedPassword,
      role: 'user',
      purchasedGames: [],
      createdAt: new Date()
    };

    const result = await users.insertOne(newUser);
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: result.insertedId.toString(),
      role: 'user'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(process.env.JWT_ACCESS_TTL)
      .sign(secret);

    res.status(201).json({ 
      token, 
      user: { 
        id: result.insertedId, 
        email: newUser.email, 
        name: newUser.name, 
        role: newUser.role,
        purchasedGames: newUser.purchasedGames 
      } 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const users = req.db.collection('users');
    const user = await users.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseña usando bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: user._id.toString(),
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(process.env.JWT_ACCESS_TTL)
      .sign(secret);

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        purchasedGames: user.purchasedGames 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener perfil del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ 
      _id: new ObjectId(req.user.userId) 
    }, { projection: { password: 0 } });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;