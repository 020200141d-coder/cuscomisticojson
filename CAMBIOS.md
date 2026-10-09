# Qué se hizo para pasar Cusco Mistico de PHP a Node.js

## 1. Punto de partida

Se revisó el `mistico.zip` entregado por el docente. Es el proyecto **original**: solo tiene el módulo **Oferta** y el login, la base `cuscomistico` con 2 tablas (`oferta`, `usuario`) y los usuarios `antonio` y `ramiro` (clave `1234`). El `error_log` y las rutas comentadas apuntan al hosting `wsperuin1` del docente.

## 2. Equivalencias archivo por archivo

| PHP (original)                                   | Node.js (nuevo)                                     |
|--------------------------------------------------|-----------------------------------------------------|
| Apache de XAMPP sirve los `.php`                 | `server.js` (Express) sirve todo en el puerto 3000  |
| `admin/config/global.php` + `Conexion.php`       | `config/db.js` + archivo `.env`                     |
| `clases/Conexion.php` + `clases/Oferta.php`      | `models/ofertaModel.js` → `listarActivas()`         |
| `admin/modelos/Oferta.php`                       | `models/ofertaModel.js`                             |
| `admin/modelos/Usuario.php` → `verificar()`      | `models/usuarioModel.js`                            |
| `admin/ajax/oferta.php` (switch `op`)            | `controllers/ofertaController.js` + `routes/ofertaRoutes.js` |
| `admin/ajax/usuario.php` (verificar / salir)     | `controllers/authController.js` + `routes/authRoutes.js`     |
| `$_FILES` + `move_uploaded_file()`               | `middlewares/upload.js` (multer)                    |
| `session_start()` / `$_SESSION`                  | `express-session` en `server.js`                    |
| `if(!isset($_SESSION["nombre"]))` en cada vista  | `middlewares/auth.js`                               |
| `index.php` (foreach de ofertas en PHP)          | `public/index.html` + `public/js/ofertas.js` (fetch) |
| `admin/vistas/header.php + oferta.php + footer.php` | `public/admin/vistas/oferta.html`                |
| `admin/index.php` (redirige al login)            | ruta `/admin` en `server.js`                        |
| `bdatos.sql`                                     | `database.sql`                                      |

## 3. Cambios en el frontend del panel

- `scripts/oferta.js`: las llamadas `../ajax/oferta.php?op=...` ahora usan la API REST (`GET`, `POST`, `PUT`, `PATCH`).
- Antes PHP devolvía la tabla con los botones ya armados en HTML (`aaData`). Ahora la API devuelve **JSON puro** y la tabla (DataTables) arma las columnas en el navegador.
- `scripts/login.js`: envía usuario y clave a `POST /api/auth/login`.
- `scripts/sesion.js` (nuevo): pide el nombre del usuario para mostrarlo en la cabecera, ya que el HTML no puede hacer `echo $_SESSION['nombre']`.

## 4. Errores del original que se corrigieron

1. **Inyección SQL**: el PHP armaba las consultas concatenando variables (`'$titulo'`). Ahora se usan parámetros `?`.
2. **Cuerpo guardado como texto `htmlspecialchars(...)`**: en PHP la función estaba dentro de comillas, así que se guardaba la palabra literal. Se limpió en `database.sql` y el controlador la quita si aparece en datos viejos.
3. **Columnas Imagen y PDF invertidas** en la tabla del panel: ahora coinciden con los encabezados.
4. **Barra de progreso falsa**: el original enviaba el archivo a `httpbin.org` (un sitio externo) solo para mover la barra. Ahora muestra el progreso real de la subida al servidor.
5. **Datos de conexión escritos en el código**: ahora están en `.env`, que no se sube a GitHub (`.gitignore`).
6. **Tildes**: la base pasó de `latin1` a `utf8mb4`.
7. Se quitó del menú lateral los enlaces comentados a páginas que no existían (`autor.php`, `nota.php`, etc.).

## 5. Qué se mantuvo igual

- Diseño del sitio y del panel (plantilla, AdminLTE, DataTables, nicEdit, bootbox).
- Funciones: listar, agregar, editar, desactivar y activar ofertas, con imagen, PDF y hasta 8 ítems de "¿Qué incluye?" (se guardan unidos con `[` como en el original).
- Login con la tabla `usuario` y la misma comparación de clave (texto plano, como el original).

## 6. Pruebas realizadas

- Login correcto e incorrecto.
- Crear oferta con 3 ítems, imagen y PDF.
- Editar la oferta (título).
- Desactivar la oferta original → desaparece del sitio público.
- Cerrar sesión → redirige al login; entrar a `oferta.html` sin sesión → redirige al login.
