import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './src/config/env.js';
import productsRoutes from './src/routes/products.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import { manejarErrores } from './src/middlewares/errors.middleware.js';

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json({ limit: '16kb' }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => {
  res.json({
    nombre: 'Proyecto final de Node.js - API de productos',
    rutas: [
      'GET /api/products', 'GET /api/products/:id',
      'POST /auth/login', 'POST /api/products/create',
      'PUT /api/products/:id', 'DELETE /api/products/:id',
    ],
  });
});
app.use('/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use(manejarErrores);

if (!process.env.VERCEL && process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Servidor disponible en http://localhost:${port}`));
}

export default app;
