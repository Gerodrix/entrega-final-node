import { initializeServerApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { obtenerFirebaseConfig } from './env.js';

const emuladoresConectados = new WeakSet();

// Cada petición usa la sesión de su usuario, sin compartir el login entre usuarios.
export async function conFirestore(token, operacion) {
  const app = initializeServerApp(obtenerFirebaseConfig(), token ? { authIdToken: token } : {});
  try {
    await getAuth(app).authStateReady();
    const db = getFirestore(app);
    if (process.env.FIRESTORE_EMULATOR_HOST && !emuladoresConectados.has(db)) {
      const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
      connectFirestoreEmulator(db, host, Number(port));
      emuladoresConectados.add(db);
    }
    return await operacion(db);
  } finally {
    await deleteApp(app);
  }
}
