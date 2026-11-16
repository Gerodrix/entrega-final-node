import { obtenerFirebaseConfig } from '../config/env.js';
import { HttpError } from '../middlewares/errors.middleware.js';

export async function validarCredenciales(email, password) {
  const { apiKey } = obtenerFirebaseConfig();
  const host = process.env.FIREBASE_AUTH_EMULATOR_HOST
    ? `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com`
    : 'https://identitytoolkit.googleapis.com';
  const respuesta = await fetch(`${host}/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
    signal: AbortSignal.timeout(10000),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    const codigo = datos.error?.message || '';
    if (respuesta.status >= 500 || /API_KEY|OPERATION_NOT_ALLOWED|CONFIGURATION_NOT_FOUND/.test(codigo)) {
      throw new Error('El servicio de autenticación no está disponible.');
    }
    throw new HttpError(401, 'Email o contraseña incorrectos.');
  }
  return datos;
}
