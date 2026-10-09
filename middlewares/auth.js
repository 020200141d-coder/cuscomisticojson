// middlewares/auth.js
// En PHP cada vista empezaba con:  if (!isset($_SESSION["nombre"])) header("Location: login.html");
// Aqui esa revision se hace en un solo lugar y se reutiliza.

// Para la API: si no hay sesion responde 401 (JSON)
function requiereSesionApi(req, res, next) {
  if (req.session && req.session.nombre) return next();
  return res.status(401).json({ error: 'Debe iniciar sesion' });
}

// Para las paginas del panel: si no hay sesion redirige al login
function requiereSesionVista(req, res, next) {
  if (req.session && req.session.nombre) return next();
  return res.redirect('/admin/vistas/login.html');
}

module.exports = { requiereSesionApi, requiereSesionVista };
