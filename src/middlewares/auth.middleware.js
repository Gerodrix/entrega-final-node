import jwt from 'jsonwebtoken';
import { obtenerJwtSecret, esAdministrador } from '../config/env.js';
import { HttpError } from './errors.middleware.js';

export function autenticar(req, res, next) {
  const bearer = /^Bearer\s+(\S+)$/i.exec(req.get('Authorization') || '');
  if (!bearer) throw new HttpError(401, 'Se requiere un Bearer Token.');
  const secret = obtenerJwtSecret();
  try {
    const usuario = jwt.verify(bearer[1], secret, {
      algorithms: ['HS256'], issuer: 'entrega-final-node', audience: 'productos-api',
    });
    if (typeof usuario.sub !== 'string' || typeof usuario.firebaseToken !== 'string') {
      throw new Error('Token incompleto.');
    }
    req.usuario = usuario;
    next();
  } catch {
    throw new HttpError(401, 'El token es inválido o está vencido.');
  }
}

export function requerirAdministrador(req, res, next) {
  if (req.usuario.rol !== 'admin' || !esAdministrador(req.usuario.sub)) {
    throw new HttpError(403, 'No tenés permisos para modificar productos.');
  }
  next();
}
