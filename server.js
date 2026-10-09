// server.js
// Punto de entrada. Reemplaza a Apache + PHP: Express sirve el sitio (public/),
// el panel admin y la API JSON en un solo servidor.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const ofertaRoutes = require('./routes/ofertaRoutes');
const authRoutes = require('./routes/authRoutes');
const { requiereSesionVista } = require('./middlewares/auth');

const app = express();

app.use(cors());
app.use(express.json());                          // lee JSON del body
app.use(express.urlencoded({ extended: true }));  // lee formularios (como $_POST)

// Sesiones (reemplaza session_start() / $_SESSION)
app.use(session({
  secret: process.env.SESSION_SECRET || 'cuscomistico',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// admin/index.php redirigia al login
app.get(['/admin', '/admin/'], (req, res) => res.redirect('/admin/vistas/login.html'));

// La vista del panel solo se muestra con sesion (antes: if(!isset($_SESSION["nombre"])) ...)
app.get('/admin/vistas/oferta.html', requiereSesionVista);

// Archivos estaticos: sitio publico, panel admin, imagenes y PDFs subidos
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api/ofertas', ofertaRoutes);
app.use('/api/auth', authRoutes);

// Errores de subida de archivos (por ejemplo, archivo demasiado grande)
app.use((err, req, res, next) => {
  res.status(400).json({ error: 'Error en la peticion', detalle: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Panel admin:        http://localhost:${PORT}/admin`);
});
