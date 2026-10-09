// scripts/oferta.js
// Misma logica que el oferta.js original del panel PHP.
// Lo que cambia: las URLs ../ajax/oferta.php?op=... ahora son rutas de la API REST
// y la tabla se arma en el navegador con los datos JSON que devuelve Node.js.

var tabla;
var API = "/api/ofertas";
var CAMPOS = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];

//Función que se ejecuta al inicio
function init() {
    mostrarform(false);
    listar();
    $("#formulario").on("submit", function (e) {
        guardaryeditar(e);
    });
    $("#imagenmuestra").hide();

    // Al elegir un archivo se muestra el boton X para quitarlo
    $("#imagen").on("change", function () { $("#btn_pr").show(); ponerProgreso(1, 0); });
    $("#archivo").on("change", function () { $("#btn_pra").show(); ponerProgreso(2, 0); });
}

// Actualiza las barras de progreso (1 = imagen, 2 = pdf)
function ponerProgreso(bandera, porcentaje) {
    var barra = document.getElementById(bandera === 1 ? 'progress-bar1' : 'progress-bar12');
    barra.setAttribute('value', porcentaje);
    barra.nextElementSibling.nextElementSibling.nextElementSibling.innerText = Math.round(porcentaje) + "%";
}

//Función limpiar
function limpiar() {
    ponerProgreso(1, 0);
    ponerProgreso(2, 0);
    $("#imagenmuestra").attr("src", "").hide();
    $("#imagen").val("");
    $("#imagenactual").val("");
    $("#btn_pr").hide();
    $("#archivo").val("");
    $("#archivol").val("").hide();
    $("#archivoactual").val("");
    $("#btn_pra").hide();
    $("#titulo").val("");
    $("#editor").val("");
    $("#idoferta").val("");
    for (var i = 1; i <= 8; i++) {
        document.getElementById("" + i).style.display = 'none';
        $("#" + CAMPOS[i]).val("");
    }
    $('#item').selectpicker('refresh');
    $('#item').selectpicker('val', 0);
}

//Función mostrar formulario
function mostrarform(flag) {
    limpiar();
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
        $("#btnagregar").hide();
        var ed = nicEditors.findEditor('editor');
        if (ed) ed.setContent('');
    } else {
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#btnagregar").show();
    }
}

//Función cancelarform
function cancelarform() {
    limpiar();
    mostrarform(false);
}

// Escapa texto para mostrarlo en la tabla
function esc(t) {
    return $("<div>").text(t == null ? "" : t).html();
}

// Quita etiquetas HTML del cuerpo y lo recorta (en PHP: substr(strip_tags(...),17,80))
function resumen(html) {
    var texto = $("<div>").html(html || "").text();
    return texto.length > 80 ? texto.substr(0, 80) + "..." : texto;
}

//Función Listar  (antes: ../ajax/oferta.php?op=listar devolvia aaData con HTML ya armado)
function listar() {
    tabla = $('#tbllistado').dataTable({
        dom: 'Bfrtip',
        buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdf'],
        ajax: {
            url: API,
            type: "get",
            dataType: "json",
            dataSrc: "",            // la API devuelve un arreglo JSON directo
            error: function (e) {
                if (e.status === 401) window.location.href = "login.html";
                console.log(e.responseText);
            }
        },
        columns: [
            { data: null, orderable: false, render: function (r) {
                var editar = '<button class="btn btn-warning" onclick="mostrar(' + r.id_oferta + ')"><i class="fa fa-pencil"></i></button> ';
                return r.estado == 1
                    ? editar + '<button class="btn btn-danger" onclick="desactivar(' + r.id_oferta + ')"><i class="fa fa-close"></i></button>'
                    : editar + '<button class="btn btn-primary" onclick="activar(' + r.id_oferta + ')"><i class="fa fa-check"></i></button>';
            }},
            { data: "titulo", render: function (d) { return esc(d); } },
            { data: "cuerpo", render: function (d) { return esc(resumen(d)); } },
            { data: "incluye", render: function (d) { return esc((d || "").split("[").join(", ")); } },
            { data: "imagen", render: function (d) {
                return d ? '<img width="150px" height="120px" src="../files/ofertas/' + encodeURIComponent(d) + '">' : '';
            }},
            { data: "archivo", render: function (d) {
                return d ? '<a href="../files/ofertas/' + encodeURIComponent(d) + '" target="_blank"><i class="fa fa-file"></i> ' + esc(d) + '</a>' : '';
            }},
            { data: "estado", render: function (d) {
                return d == 1 ? '<span class="label bg-green">Activado</span>' : '<span class="label bg-red">Desactivado</span>';
            }}
        ],
        bDestroy: true,
        iDisplayLength: 5,
        order: []   // respeta el orden de la API (id_oferta DESC)
    }).DataTable();
}

//Función para guardar o editar
// Antes: POST ../ajax/oferta.php?op=guardaryeditar  (un solo archivo decidia si insertar o editar)
// Ahora: sin id -> POST /api/ofertas   |   con id -> PUT /api/ofertas/:id
function guardaryeditar(e) {
    e.preventDefault();
    $("#btnGuardar").prop("disabled", true);

    var formData = new FormData($("#formulario")[0]);
    formData.set("editor", nicEditors.findEditor('editor').getContent());

    var id = $("#idoferta").val();
    var tieneImagen = $("#imagen")[0].files.length > 0;
    var tieneArchivo = $("#archivo")[0].files.length > 0;

    $.ajax({
        url: id ? API + "/" + id : API,
        type: id ? "PUT" : "POST",
        data: formData,
        contentType: false,
        processData: false,
        // progreso real de la subida (antes se simulaba enviando el archivo a httpbin.org)
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            xhr.upload.addEventListener("progress", function (ev) {
                if (!ev.lengthComputable) return;
                var p = (ev.loaded / ev.total) * 100;
                if (tieneImagen) ponerProgreso(1, p);
                if (tieneArchivo) ponerProgreso(2, p);
            });
            return xhr;
        },
        success: function (datos) {
            bootbox.alert(datos.mensaje);
            mostrarform(false);
            tabla.ajax.reload();
        },
        error: function (xhr) {
            if (xhr.status === 401) return window.location.href = "login.html";
            var r = xhr.responseJSON || {};
            bootbox.alert((r.error || "Error al guardar") + (r.detalle ? ": " + r.detalle : ""));
            $("#btnGuardar").prop("disabled", false);
        }
    });
}

//Función mostrar (antes: $.post("../ajax/oferta.php?op=mostrar") -> ahora GET /api/ofertas/:id)
function mostrar(idoferta) {
    $.getJSON(API + "/" + idoferta, function (data) {
        mostrarform(true);
        if (data.imagen) {
            $("#imagenmuestra").show().attr("src", "../files/ofertas/" + data.imagen);
        }
        $("#imagenactual").val(data.imagen);
        $("#titulo").val(data.titulo);
        nicEditors.findEditor('editor').setContent(data.cuerpo || "");
        $("#idoferta").val(data.id_oferta);
        $("#archivoactual").val(data.archivo);
        $("#archivol").val(data.archivo).show();

        var cadena = data.incluye || "";
        if (cadena === "") {
            $('#item').selectpicker('refresh');
            $('#item').selectpicker('val', 0);
        } else {
            var partes = cadena.split("[");
            var valores = partes.length;
            for (var i = 1; i <= 8; i++) {
                if (i <= valores) {
                    document.getElementById("" + i).style.display = 'block';
                    $("#" + CAMPOS[i]).val(partes[i - 1]);
                }
            }
            $('#item').selectpicker('refresh');
            $('#item').selectpicker('val', valores);
        }
    });
}

// Cambia el estado (desactivar / activar) con PATCH
function cambiarEstado(idoferta, accion, pregunta) {
    bootbox.confirm(pregunta, function (result) {
        if (!result) return;
        $.ajax({
            url: API + "/" + idoferta + "/" + accion,
            type: "PATCH",
            success: function (r) {
                bootbox.alert(r.mensaje);
                tabla.ajax.reload();
            },
            error: function (xhr) {
                bootbox.alert((xhr.responseJSON && xhr.responseJSON.error) || "No se pudo cambiar el estado");
            }
        });
    });
}

//Función para desactivar registros
function desactivar(idoferta) {
    cambiarEstado(idoferta, "desactivar", "¿Está Seguro de desactivar la oferta?");
}

//Función para activar registros
function activar(idoferta) {
    cambiarEstado(idoferta, "activar", "¿Está Seguro de activar la oferta?");
}

// Boton X de cada barra de progreso: quita el archivo elegido
function limpiar_prog(bandera) {
    ponerProgreso(bandera, 0);
    if (bandera === 1) { $("#imagen").val(""); $("#btn_pr").hide(); }
    else { $("#archivo").val(""); $("#btn_pra").hide(); }
}

// Muestra tantos campos "¿Que incluye?" como items se elijan
function Citem(valor) {
    for (var i = 1; i <= 8; i++) {
        if (valor != 0 && i <= valor) {
            document.getElementById("" + i).style.display = 'block';
        } else {
            document.getElementById("" + i).style.display = 'none';
            $("#" + CAMPOS[i]).val("");
        }
    }
}

init();
