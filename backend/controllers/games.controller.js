import { responseSuccess, responseError } from '../helpers/response.helper.js';
import joi from 'joi';
import { getGames, postGame } from '../services/games.service.js';

// Esquema de validación con Joi
const schemaGame = joi.object({
  nombre: joi.string().min(3).max(100).required(),
  categoria: joi.string().min(3).max(50).required(),
  descripcion: joi.string().min(10).max(500).required(),
  precio: joi.number().min(0).required(),
  esGratis: joi.boolean().required(),
  imagenUrl: joi.string().uri().optional()
});

// Handler para obtener todos los juegos
const getGamesHandler = async (req, res) => {
  try {
    const games = await getGames();

    res.status(200).json(responseSuccess("Juegos obtenidos exitosamente", games));
  } catch (error) {
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';

    switch (error.code) {
      case 'DATA_NOT_FOUND':
        errorCode = 404;
        errorMessage = error.code;
        break;
    }

    return res.status(errorCode).json({
      message: errorMessage
    });
  }
};

// Handler para crear un nuevo juego
const postGameHandler = async (req, res) => {
  try {
    const data = req.body;
    const { error, value } = schemaGame.validate(data, { abortEarly: false });

    if (error) {
      return res.status(400).json(responseError(error.details.map(e => e.message)));
    }

    const gameId = await postGame(value);

    res.status(201).json(responseSuccess("Juego guardado exitosamente", gameId));

  } catch (error) {
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';

    switch (error.code) {
      case 'DATA_EXISTS':
        errorCode = 409;
        errorMessage = error.code;
        break;
    }

    return res.status(errorCode).json({
      message: errorMessage
    });
  }
};

export {
  getGamesHandler,
  postGameHandler
};
