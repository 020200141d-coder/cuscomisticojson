// models/ofertaModel.js
// Equivale a admin/modelos/Oferta.php y clases/Oferta.php.
// Solo consultas SQL. Se usan parametros "?" en lugar de concatenar variables
// (en PHP se armaba el SQL con '$titulo', lo que permitia inyeccion SQL).

const pool = require('../config/db');

const OfertaModel = {
  // PHP: listar()
  async listar() {
    const [rows] = await pool.query('SELECT * FROM oferta ORDER BY id_oferta DESC');
    return rows;
  },

  // PHP: clases/Oferta.php -> mostrar_todo() (usado por la pagina publica)
  async listarActivas() {
    const [rows] = await pool.query("SELECT * FROM oferta WHERE estado = 1 ORDER BY id_oferta DESC");
    return rows;
  },

  // PHP: mostrar($idoferta)
  async mostrar(id) {
    const [rows] = await pool.query('SELECT * FROM oferta WHERE id_oferta = ?', [id]);
    return rows[0];
  },

  // PHP: insertar(...)
  async insertar({ titulo, cuerpo, incluye, imagen, archivo }) {
    const [result] = await pool.query(
      'INSERT INTO oferta (titulo, cuerpo, incluye, imagen, archivo, estado) VALUES (?, ?, ?, ?, ?, 1)',
      [titulo, cuerpo, incluye, imagen, archivo]
    );
    return result.insertId;
  },

  // PHP: editar(...)
  async editar(id, { titulo, cuerpo, incluye, imagen, archivo }) {
    const [result] = await pool.query(
      'UPDATE oferta SET titulo = ?, cuerpo = ?, incluye = ?, imagen = ?, archivo = ? WHERE id_oferta = ?',
      [titulo, cuerpo, incluye, imagen, archivo, id]
    );
    return result.affectedRows;
  },

  // PHP: desactivar() / activar()  (borrado logico: estado 0 / 1)
  async cambiarEstado(id, estado) {
    const [result] = await pool.query('UPDATE oferta SET estado = ? WHERE id_oferta = ?', [estado, id]);
    return result.affectedRows;
  }
};

module.exports = OfertaModel;
