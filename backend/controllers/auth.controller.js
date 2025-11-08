import { responseSuccess, responseError } from '../helpers/response.helper.js';
import joi from 'joi';
import { login, register as registerService } from '../services/auth.service.js';
import { verifyAccessToken } from '../helpers/auth.helper.js';


const schemaAuth = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(100).required()
});


const schemaRegister = joi.object({
  email: joi.string().email().required(),
  name: joi.string().min(1).max(100).required(),
  password: joi.string().min(6).required()
});


const loginHandler = async (req, res) => {
  try {
    const data = req.body;
    const { error } = schemaAuth.validate(data, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const { token, user } = await login(data);

    res.status(200).json(responseSuccess("success", { token, user }));

  } catch (error) {
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';

    switch (error.code) {
      case 'DATA_NOT_FOUND':
      case 'AUTH_ERROR':
        errorCode = 400;
        errorMessage = error.code;
        break;
    }

    res.status(errorCode).json({ message: errorMessage });
  }
};


const registerHandler = async (req, res) => {
  try {
    const data = req.body;
    const { error } = schemaRegister.validate(data, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: 'Datos de registro inválidos' });
    }

    
    const { token, user } = await registerService(data);

    res.status(201).json(responseSuccess("success", { token, user }));

  } catch (error) {
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';

    switch (error.code) {
      case 'AUTH_ERROR':
      case 'USER_ALREADY_EXISTS':
        errorCode = 400;
        errorMessage = error.code;
        break;
    }

    res.status(errorCode).json({ message: errorMessage });
  }
};

const verifyTokenHandler = () => {
  return async (req, res, next) => {
    try {
      const auth = req.header('Authorization');
      const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return res.status(401).json(responseError('Bearer token no enviado'));

      await verifyAccessToken(token);

      next();
    } catch (err) {
      return res.status(401).json(responseError('Token invalido o expirado'));
    }
  };
};

export {
  loginHandler,
  registerHandler,
  verifyTokenHandler
};
