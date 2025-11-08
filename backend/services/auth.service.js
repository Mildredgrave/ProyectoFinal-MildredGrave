import { getDb } from '../configs/mongodb.config.js';
import { issueAccessToken } from '../helpers/auth.helper.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

// ─────────── LOGIN ───────────
const login = async (data) => {
  const db = getDb();
  console.log('Intentando login con:', data);

  const usuarioValido = await db.collection('users').findOne({ email: data.email });

  if (!usuarioValido) {
    const error = new Error('AUTH_ERROR');
    error.code = 'AUTH_ERROR';
    throw error;
  }

  // Comparar contraseña
  const isMatch = await bcrypt.compare(data.password, usuarioValido.password);
  if (!isMatch) {
    const error = new Error('AUTH_ERROR');
    error.code = 'AUTH_ERROR';
    throw error;
  }

  const token = await issueAccessToken({
    sub: usuarioValido._id,
    role: usuarioValido.role
  });

  return {
    token,
    user: {
      id: usuarioValido._id,
      name: usuarioValido.name,
      email: usuarioValido.email,
      role: usuarioValido.role
    }
  };
};

// ─────────── REGISTER ───────────
const register = async (data) => {
  const db = getDb();

  // Verificar si el usuario ya existe
  const existingUser = await db.collection('users').findOne({ email: data.email });
  if (existingUser) {
    const error = new Error('USER_ALREADY_EXISTS');
    error.code = 'USER_ALREADY_EXISTS';
    throw error;
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Crear nuevo usuario
  const newUser = {
    email: data.email,
    name: data.name,
    password: hashedPassword,
    role: 'user',
    purchasedGames: [],
    createdAt: new Date()
  };

  const result = await db.collection('users').insertOne(newUser);

  const token = await issueAccessToken({
    sub: result.insertedId,
    role: newUser.role
  });

  return {
    token,
    user: {
      id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  };
};

export {
  login,
  register
};
