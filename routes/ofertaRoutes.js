// routes/ofertaRoutes.js
// Reemplaza las URLs  ../ajax/oferta.php?op=...  por rutas REST.

const express = require('express');
const router = express.Router();
const OfertaController = require('../controllers/ofertaController');
const { requiereSesionApi } = require('../middlewares/auth');
const subirArchivos = require('../middlewares/upload');

// Publica (la usa index.html del sitio)
router.get('/publicas', OfertaController.listarPublicas);           // GET   /api/ofertas/publicas

// Panel de administracion (requieren sesion)
router.get('/', requiereSesionApi, OfertaController.listar);                       // op=listar
router.get('/:id', requiereSesionApi, OfertaController.mostrar);                   // op=mostrar
router.post('/', requiereSesionApi, subirArchivos, OfertaController.insertar);     // op=guardaryeditar (nuevo)
router.put('/:id', requiereSesionApi, subirArchivos, OfertaController.editar);     // op=guardaryeditar (editar)
router.patch('/:id/desactivar', requiereSesionApi, OfertaController.desactivar);   // op=desactivar
router.patch('/:id/activar', requiereSesionApi, OfertaController.activar);         // op=activar

module.exports = router;
