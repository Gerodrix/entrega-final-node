import * as productos from '../models/products.model.js';
import { HttpError } from '../middlewares/errors.middleware.js';

function validarId(id) {
  if (!id || id.includes('/') || Buffer.byteLength(id) > 1500 || ['.', '..'].includes(id)) {
    throw new HttpError(400, 'El ID del producto es inválido.');
  }
}

function validarProducto(body, parcial = false) {
  const campos = ['title', 'price', 'category', 'description', 'image'];
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      !Object.keys(body).length || Object.keys(body).some(campo => !campos.includes(campo))) {
    throw new HttpError(400, 'Enviá un producto con title, price, category y, opcionalmente, description e image.');
  }
  if (!parcial && ['title', 'price', 'category'].some(campo => body[campo] === undefined)) {
    throw new HttpError(400, 'Los campos title, price y category son obligatorios.');
  }
  const producto = { ...body };
  for (const [campo, limite] of [['title', 120], ['category', 80], ['description', 2000], ['image', 2000]]) {
    if (producto[campo] === undefined) continue;
    if (typeof producto[campo] !== 'string' || producto[campo].length > limite ||
        (['title', 'category'].includes(campo) && !producto[campo].trim())) {
      throw new HttpError(400, `El campo ${campo} es inválido.`);
    }
    producto[campo] = producto[campo].trim();
  }
  if (producto.price !== undefined &&
      (typeof producto.price !== 'number' || !Number.isFinite(producto.price) || producto.price < 0)) {
    throw new HttpError(400, 'El precio debe ser un número mayor o igual a cero.');
  }
  return producto;
}

export async function listarProductos() {
  return productos.listar();
}

export async function buscarProducto(id) {
  validarId(id);
  return productos.buscar(id);
}

export async function crearProducto(body, token) {
  return productos.crear(validarProducto(body), token);
}

export async function actualizarProducto(id, body, token) {
  validarId(id);
  return productos.actualizar(id, validarProducto(body, true), token);
}

export async function eliminarProducto(id, token) {
  validarId(id);
  return productos.eliminar(id, token);
}
