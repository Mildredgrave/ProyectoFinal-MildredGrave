import { getDb } from '../configs/mongodb.config.js';

const getGames = async () => {
  const db = getDb();
  const games = await db.collection('games').find().toArray();
  
  if (!games || games.length === 0) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }

  return games;
};

const postGame = async (data) => {
  const db = getDb();

  // Verifica si ya existe un juego con el mismo nombre
  const existingGame = await db.collection('games').findOne({ nombre: data.nombre });

  if (existingGame) {
    const error = new Error('DATA_EXISTS');
    error.code = 'DATA_EXISTS';
    throw error;
  }
  
  // Inserta el nuevo juego
  const nuevoGame = await db.collection('games').insertOne(data);
  
  return nuevoGame.insertedId;
};

export { 
  getGames,
  postGame
};
