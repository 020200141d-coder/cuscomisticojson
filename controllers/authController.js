// controllers/authController.js
// Equivale a los casos 'verificar' y 'salir' de admin/ajax/usuario.php

const UsuarioModel = require('../models/usuarioModel');

const AuthController = {
  // POST /api/auth/login   (op=verificar)
  async login(req, res) {
    try {
      const { logina, clavea } = req.body;
      if (!logina || !clavea) return res.status(400).json({ error: 'Ingrese usuario y password' });

      const usuario = await UsuarioModel.verificar(logina, clavea);
      if (!usuario) return res.status(401).json({ error: 'Usuario y/o Password incorrectos' });

      // equivalente a $_SESSION['idusuario'] y $_SESSION['nombre']
      req.session.idusuario = usuario.id_usuario;
      req.session.nombre = usuario.usuario;
      res.json({ id_usuario: usuario.id_usuario, usuario: usuario.usuario });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesion', detalle: error.message });
    }
  },

  // GET /api/auth/sesion  -> devuelve el nombre para mostrarlo en la cabecera
  // (en PHP: echo $_SESSION['nombre'] dentro de header.php)
  sesion(req, res) {
    if (!req.session.nombre) return res.status(401).json({ error: 'Sin sesion' });
    res.json({ idusuario: req.session.idusuario, nombre: req.session.nombre });
  },

  // GET /api/auth/salir   (op=salir)
  salir(req, res) {
    req.session.destroy(() => {
      res.redirect('/admin/vistas/login.html');
    });
  }
};

module.exports = AuthController;
