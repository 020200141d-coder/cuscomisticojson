// controllers/ofertaController.js
// Equivale a admin/ajax/oferta.php. En PHP habia un switch ($_GET["op"])
// con los casos guardaryeditar, desactivar, activar, mostrar y listar.
// Aqui cada caso es una funcion y la ruta (routes/ofertaRoutes.js) decide cual se llama.

const OfertaModel = require('../models/ofertaModel');

const CAMPOS_ITEMS = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho'];

// En PHP habia un switch($item) de 8 casos que unia los items con "[".
// Hace lo mismo con un bucle.
function armarIncluye(body) {
  const cantidad = parseInt(body.item, 10) || 0;
  const partes = [];
  for (let i = 0; i < cantidad && i < 8; i++) {
    partes.push((body[CAMPOS_ITEMS[i]] || '').trim());
  }
  return partes.join('[');
}

// Los registros antiguos del PHP guardaban el cuerpo como "htmlspecialchars(...)"
// (era un error del PHP). Esto quita ese envoltorio si aparece.
function limpiarCuerpo(cuerpo) {
  if (!cuerpo) return '';
  const m = cuerpo.match(/^htmlspecialchars\(([\s\S]*)\)$/);
  return m ? m[1] : cuerpo;
}

function prepararDatos(req) {
  const b = req.body;
  const files = req.files || {};
  return {
    titulo: (b.titulo || '').trim(),
    cuerpo: b.editor || '',
    incluye: armarIncluye(b),
    // si no se subio un archivo nuevo, se conserva el actual (imagenactual / archivoactual)
    imagen: files.imagen ? files.imagen[0].filename : (b.imagenactual || ''),
    archivo: files.archivo ? files.archivo[0].filename : (b.archivoactual || '')
  };
}

const OfertaController = {
  // GET /api/ofertas  (op=listar)
  async listar(req, res) {
    try {
      const filas = await OfertaModel.listar();
      res.json(filas.map(f => ({ ...f, cuerpo: limpiarCuerpo(f.cuerpo) })));
    } catch (error) {
      res.status(500).json({ error: 'Error al listar ofertas', detalle: error.message });
    }
  },

  // GET /api/ofertas/publicas  (clases/Oferta.php -> mostrar_todo)
  async listarPublicas(req, res) {
    try {
      const filas = await OfertaModel.listarActivas();
      res.json(filas.map(f => ({ ...f, cuerpo: limpiarCuerpo(f.cuerpo) })));
    } catch (error) {
      res.status(500).json({ error: 'Error al listar ofertas', detalle: error.message });
    }
  },

  // GET /api/ofertas/:id  (op=mostrar)
  async mostrar(req, res) {
    try {
      const oferta = await OfertaModel.mostrar(req.params.id);
      if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });
      oferta.cuerpo = limpiarCuerpo(oferta.cuerpo);
      res.json(oferta);
    } catch (error) {
      res.status(500).json({ error: 'Error al mostrar oferta', detalle: error.message });
    }
  },

  // POST /api/ofertas  (op=guardaryeditar sin idoferta)
  async insertar(req, res) {
    try {
      const datos = prepararDatos(req);
      if (!datos.titulo) return res.status(400).json({ error: 'El titulo es obligatorio' });
      const id = await OfertaModel.insertar(datos);
      res.status(201).json({ mensaje: 'Oferta registrada', id_oferta: id });
    } catch (error) {
      res.status(500).json({ error: 'Oferta no se pudo registrar', detalle: error.message });
    }
  },

  // PUT /api/ofertas/:id  (op=guardaryeditar con idoferta)
  async editar(req, res) {
    try {
      const datos = prepararDatos(req);
      if (!datos.titulo) return res.status(400).json({ error: 'El titulo es obligatorio' });
      const afectadas = await OfertaModel.editar(req.params.id, datos);
      if (!afectadas) return res.status(404).json({ error: 'Oferta no encontrada' });
      res.json({ mensaje: 'Oferta actualizada' });
    } catch (error) {
      res.status(500).json({ error: 'Oferta no se pudo actualizar', detalle: error.message });
    }
  },

  // PATCH /api/ofertas/:id/desactivar  (op=desactivar)
  async desactivar(req, res) {
    try {
      await OfertaModel.cambiarEstado(req.params.id, 0);
      res.json({ mensaje: 'Oferta desactivada' });
    } catch (error) {
      res.status(500).json({ error: 'Oferta no se puede desactivar', detalle: error.message });
    }
  },

  // PATCH /api/ofertas/:id/activar  (op=activar)
  async activar(req, res) {
    try {
      await OfertaModel.cambiarEstado(req.params.id, 1);
      res.json({ mensaje: 'Oferta activada' });
    } catch (error) {
      res.status(500).json({ error: 'Oferta no se puede activar', detalle: error.message });
    }
  }
};

module.exports = OfertaController;
