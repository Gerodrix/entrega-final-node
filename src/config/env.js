import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export function obtenerFirebaseConfig() {
  const { FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_AUTH_DOMAIN } = process.env;
  if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
    throw new Error('Falta configurar Firebase.');
  }
  return {
    apiKey: FIREBASE_API_KEY,
    projectId: FIREBASE_PROJECT_ID,
    authDomain: FIREBASE_AUTH_DOMAIN,
  };
}

export function obtenerJwtSecret() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
  }
  return process.env.JWT_SECRET;
}

export function esAdministrador(uid) {
  return (process.env.ADMIN_UIDS || '').split(',').map(id => id.trim()).includes(uid);
}
