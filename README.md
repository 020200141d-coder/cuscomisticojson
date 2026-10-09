# Cusco Mistico Travel — versión Node.js

Migración del CRUD de ofertas de la agencia **Cusco Mistico Travel** (proyecto original en PHP + MySQL entregado por el docente) a **Node.js + Express + MySQL**, siguiendo la misma estructura del ejemplo `crud-nodejs` de la Sesión 10 (Plataformas para el Desarrollo de Aplicaciones).

## Estructura

```
cuscomisticojson/
├── config/
│   └── db.js                  # Conexión a MySQL (antes admin/config/global.php + Conexion.php)
├── models/
│   ├── ofertaModel.js         # Consultas SQL de oferta (antes admin/modelos/Oferta.php y clases/Oferta.php)
│   └── usuarioModel.js        # Login (antes metodo verificar() de admin/modelos/Usuario.php)
├── controllers/
│   ├── ofertaController.js    # Lógica del CRUD (antes admin/ajax/oferta.php)
│   └── authController.js      # Iniciar / cerrar sesión (antes admin/ajax/usuario.php)
├── routes/
│   ├── ofertaRoutes.js        # /api/ofertas
│   └── authRoutes.js          # /api/auth
├── middlewares/
│   ├── auth.js                # Revisa la sesión (antes if(!isset($_SESSION["nombre"])))
│   └── upload.js              # Subida de imagen y PDF con multer (antes $_FILES)
├── public/                    # Todo lo que ve el navegador
│   ├── index.html             # Sitio web (antes index.php)
│   ├── js/ofertas.js          # Carga las ofertas del mes desde la API
│   ├── css/ img/ fonts/ js/   # Plantilla original del sitio
│   └── admin/
│       ├── vistas/login.html
│       ├── vistas/oferta.html # Panel (antes header.php + oferta.php + footer.php)
│       ├── vistas/scripts/    # login.js, oferta.js, sesion.js, nicEdit.js
│       ├── public/            # AdminLTE, Bootstrap, DataTables (sin cambios)
│       └── files/ofertas/     # Imágenes y PDFs subidos
├── database.sql               # Base de datos cuscomistico (tablas oferta y usuario)
├── server.js                  # Punto de entrada
├── .env.example
└── package.json
```

## Instalación (Windows + XAMPP)

1. Iniciar **MySQL** en el panel de XAMPP (Apache no hace falta).
2. En phpMyAdmin → pestaña **SQL** → pegar el contenido de `database.sql` → **Continuar**.
3. Copiar `.env.example` y renombrarlo a `.env` (revisar que no quede `.env.txt`).
4. En una terminal dentro de la carpeta del proyecto:
   ```
   npm install
   npm start
   ```
5. Abrir:
   - Sitio web: http://localhost:3000
   - Panel admin: http://localhost:3000/admin  → usuario `ramiro` / clave `1234`

## Endpoints de la API

| Método | Ruta                          | Equivale en PHP                         | Sesión |
|--------|-------------------------------|------------------------------------------|--------|
| GET    | /api/ofertas/publicas         | `clases/Oferta.php` → `mostrar_todo()`   | No     |
| GET    | /api/ofertas                  | `ajax/oferta.php?op=listar`              | Sí     |
| GET    | /api/ofertas/:id              | `ajax/oferta.php?op=mostrar`             | Sí     |
| POST   | /api/ofertas                  | `ajax/oferta.php?op=guardaryeditar` (nuevo)  | Sí |
| PUT    | /api/ofertas/:id              | `ajax/oferta.php?op=guardaryeditar` (editar) | Sí |
| PATCH  | /api/ofertas/:id/desactivar   | `ajax/oferta.php?op=desactivar`          | Sí     |
| PATCH  | /api/ofertas/:id/activar      | `ajax/oferta.php?op=activar`             | Sí     |
| POST   | /api/auth/login               | `ajax/usuario.php?op=verificar`          | No     |
| GET    | /api/auth/sesion              | `echo $_SESSION['nombre']`               | Sí     |
| GET    | /api/auth/salir               | `ajax/usuario.php?op=salir`              | —      |

Ver `CAMBIOS.md` para el detalle de lo que se modificó respecto al proyecto PHP.
