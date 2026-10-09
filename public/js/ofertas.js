// js/ofertas.js
// Reemplaza el foreach de PHP de index.php (seccion "Tour Oferta del Mes").
// Pide las ofertas activas a la API y arma el mismo HTML que generaba PHP.

(function () {
  const contenedor = document.getElementById('ofertas-publicas');
  if (!contenedor) return;

  // Evita que un titulo con < > rompa la pagina
  function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto == null ? '' : texto;
    return div.innerHTML;
  }

  function listaHTML(items) {
    return '<ul class="list">' +
      items.map(i => '<li><i class="fa fa-caret-right"></i>' + escapar(i) + '</li>').join('') +
      '</ul>';
  }

  function ofertaHTML(r) {
    // Los items vienen separados por "[" -> se reparten en dos columnas (igual que en PHP)
    let columnas = '';
    if (r.incluye) {
      const division = r.incluye.split('[');
      const mitad = Math.ceil(division.length / 2);
      columnas =
        '<div class="col-lg-6">' + listaHTML(division.slice(0, mitad)) + '</div>' +
        '<div class="col-lg-6">' + listaHTML(division.slice(mitad)) + '</div>';
    }
    return `
      <div class="col-lg-6 col-12">
        <div class="choose-left">
          <h3>${escapar(r.titulo)}</h3>
          <p>${r.cuerpo || ''}</p>
          <div class="row">${columnas}</div>
          <br /><a href="admin/files/ofertas/${encodeURIComponent(r.archivo || '')}" class="btn second" target="_blank">Descargar Programa <i class="fa fa-download"></i></a>
        </div>
      </div>
      <div class="col-lg-6 col-md-12">
        <div class="appointment-image">
          <img src="admin/files/ofertas/${encodeURIComponent(r.imagen || '')}" alt="${escapar(r.titulo)}">
        </div>
      </div>`;
  }

  fetch('/api/ofertas/publicas')
    .then(res => res.json())
    .then(ofertas => {
      if (!Array.isArray(ofertas) || ofertas.length === 0) {
        contenedor.innerHTML = '<div class="col-12"><p>No hay ofertas disponibles por el momento.</p></div>';
        return;
      }
      contenedor.innerHTML = ofertas.map(ofertaHTML).join('');
    })
    .catch(() => {
      contenedor.innerHTML = '<div class="col-12"><p>No se pudieron cargar las ofertas.</p></div>';
    });
})();
