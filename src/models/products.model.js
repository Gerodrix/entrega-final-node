import { collection, doc, getDocs, getDoc, addDoc, runTransaction } from 'firebase/firestore';
import { conFirestore } from '../config/firebase.js';
import { HttpError } from '../middlewares/errors.middleware.js';

export function listar() {
  return conFirestore(null, async db => {
    const resultado = await getDocs(collection(db, 'products'));
    return resultado.docs.map(documento => ({ ...documento.data(), id: documento.id }));
  });
}

export function buscar(id) {
  return conFirestore(null, async db => {
    const resultado = await getDoc(doc(db, 'products', id));
    if (!resultado.exists()) throw new HttpError(404, 'Producto no encontrado.');
    return { ...resultado.data(), id: resultado.id };
  });
}

export function crear(producto, token) {
  return conFirestore(token, async db => {
    const referencia = await addDoc(collection(db, 'products'), producto);
    return { ...producto, id: referencia.id };
  });
}

export function actualizar(id, cambios, token) {
  return conFirestore(token, db => runTransaction(db, async transaccion => {
    const referencia = doc(db, 'products', id);
    const producto = await transaccion.get(referencia);
    if (!producto.exists()) throw new HttpError(404, 'Producto no encontrado.');
    transaccion.update(referencia, cambios);
    return { ...producto.data(), ...cambios, id };
  }));
}

export function eliminar(id, token) {
  return conFirestore(token, db => runTransaction(db, async transaccion => {
    const referencia = doc(db, 'products', id);
    const producto = await transaccion.get(referencia);
    if (!producto.exists()) throw new HttpError(404, 'Producto no encontrado.');
    transaccion.delete(referencia);
    return { ...producto.data(), id };
  }));
}
