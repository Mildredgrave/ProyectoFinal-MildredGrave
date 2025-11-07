import express from "express";
import { getDb } from "../configs/mongodb.config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const games = await db.collection("games").find().toArray();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los juegos" });
  }
});

export default router;
