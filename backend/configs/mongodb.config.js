import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB;
const mongoUser = process.env.MONGO_DB_USER;
const mongoPassword = process.env.MONGO_DB_PASSWORD;  

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`;

let client;
let db;

export const connectToMongo = async () => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(mongoDb);
    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}

export const getDb = () => {
  if (!db) {
    connectToMongo();
    throw new Error("No hay conexión a la base de datos. Asegúrate de llamar a connectToMongo primero.");
  }
  return db;
}

