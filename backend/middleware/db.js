import { getDb } from '../configs/mongodb.config.js';

// Middleware para inyectar la conexión a MongoDB en cada request
export const dbMiddleware = (req, res, next) => {
  try {
    req.db = getDb();
    next();
  } catch (error) {
    console.error('Error al obtener conexión DB:', error);
    res.status(500).json({ message: 'Error de conexión a la base de datos' });
  }
};