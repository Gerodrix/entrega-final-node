export class HttpError extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

export function manejarErrores(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error instanceof HttpError ? error.status : 500;
  let mensaje = error.message;
  if (error.type === 'entity.parse.failed' || error instanceof URIError) {
    status = 400;
    mensaje = 'La petición contiene JSON o parámetros inválidos.';
  } else if (error.type === 'entity.too.large') {
    status = 400;
    mensaje = 'El cuerpo de la petición es demasiado grande.';
  }
  if (status === 401) res.set('WWW-Authenticate', 'Bearer');
  if (status >= 500) {
    console.error('Error del servicio:', error.code || error.name);
    mensaje = 'No se pudo completar la solicitud. Intentá nuevamente.';
  }
  res.status(status).json({ error: mensaje });
}
