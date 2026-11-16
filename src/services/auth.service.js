import jwt from 'jsonwebtoken';
import { validarCredenciales } from '../models/auth.model.js';
import { obtenerJwtSecret, esAdministrador } from '../config/env.js';
import { HttpError } from '../middlewares/errors.middleware.js';

export async function iniciarSesion(body) {
  const { email, password } = body || {};
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== 'string' || !password || password.length > 4096) {
    throw new HttpError(400, 'Ingresá un email y una contraseña válidos.');
  }
  const secret = obtenerJwtSecret();
  const sesion = await validarCredenciales(email.trim(), password);
  const rol = esAdministrador(sesion.localId) ? 'admin' : 'lector';
  const expiresIn = Math.min(Number(sesion.expiresIn) || 3600, 3600);
  const token = jwt.sign({ rol, firebaseToken: sesion.idToken }, secret, {
    algorithm: 'HS256', subject: sesion.localId,
    issuer: 'entrega-final-node', audience: 'productos-api', expiresIn,
  });
  return { token, tokenType: 'Bearer', expiresIn, usuario: { email: sesion.email, rol } };
}
