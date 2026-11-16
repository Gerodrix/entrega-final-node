import { Router } from 'express';
import * as productos from '../controllers/products.controller.js';
import { autenticar, requerirAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/', productos.listar);
router.get('/:id', productos.buscar);
router.post('/create', autenticar, requerirAdministrador, productos.crear);
router.put('/:id', autenticar, requerirAdministrador, productos.actualizar);
router.delete('/:id', autenticar, requerirAdministrador, productos.eliminar);
export default router;
