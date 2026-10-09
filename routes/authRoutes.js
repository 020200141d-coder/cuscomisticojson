// routes/authRoutes.js
// Reemplaza ../ajax/usuario.php?op=verificar  y  ?op=salir

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);   // POST /api/auth/login
router.get('/sesion', AuthController.sesion);  // GET  /api/auth/sesion
router.get('/salir', AuthController.salir);    // GET  /api/auth/salir

module.exports = router;
