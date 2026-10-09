// models/usuarioModel.js
// Equivale al metodo verificar() de admin/modelos/Usuario.php
// (el resto de metodos de Usuario.php apuntaban a columnas que no existen
// en la tabla usuario del bdatos.sql, por eso no se migraron).

const pool = require('../config/db');

const UsuarioModel = {
  async verificar(login, clave) {
    const [rows] = await pool.query(
      'SELECT id_usuario, usuario, tipo FROM usuario WHERE usuario = ? AND pass = ?',
      [login, clave]
    );
    return rows[0]; // undefined si no coincide
  }
};

module.exports = UsuarioModel;
