import * as productos from '../services/products.service.js';

export async function listar(req, res) {
  res.json(await productos.listarProductos());
}

export async function buscar(req, res) {
  res.json(await productos.buscarProducto(req.params.id));
}

export async function crear(req, res) {
  const producto = await productos.crearProducto(req.body, req.usuario.firebaseToken);
  res.status(201).location(`/api/products/${producto.id}`).json(producto);
}

export async function actualizar(req, res) {
  res.json(await productos.actualizarProducto(req.params.id, req.body, req.usuario.firebaseToken));
}

export async function eliminar(req, res) {
  res.json(await productos.eliminarProducto(req.params.id, req.usuario.firebaseToken));
}
