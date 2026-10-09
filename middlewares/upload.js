// middlewares/upload.js
// Reemplaza el bloque de $_FILES + move_uploaded_file() de admin/ajax/oferta.php.
// Guarda la imagen (jpg/png) y el PDF en public/admin/files/ofertas,
// con el mismo nombre original del archivo (igual que hacia el PHP).

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpeta = path.join(__dirname, '..', 'public', 'admin', 'files', 'ofertas');
if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpeta),
  filename: (req, file, cb) => {
    // se limpia el nombre para evitar rutas raras ("../") o espacios
    const limpio = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, limpio); // si ya existe, se sobrescribe (en PHP: unlink + move)
  }
});

function fileFilter(req, file, cb) {
  if (file.fieldname === 'imagen') {
    return cb(null, ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype));
  }
  if (file.fieldname === 'archivo') {
    return cb(null, file.mimetype === 'application/pdf');
  }
  cb(null, false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

module.exports = upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'archivo', maxCount: 1 }
]);
