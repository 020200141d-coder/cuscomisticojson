// scripts/sesion.js
// En PHP el header mostraba <?php echo $_SESSION['nombre']; ?>.
// Como ahora la vista es HTML puro, se pide el nombre a la API.

$.getJSON("/api/auth/sesion")
    .done(function (data) {
        $(".nombre-usuario").text(data.nombre);
    })
    .fail(function () {
        // sesion vencida -> volver al login
        window.location.href = "login.html";
    });
