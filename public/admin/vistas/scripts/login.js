// scripts/login.js
// Antes: $.post("../ajax/usuario.php?op=verificar", ...)
// Ahora: POST /api/auth/login  (la API responde JSON)

$("#frmAcceso").on('submit', function (e) {
    e.preventDefault();
    var logina = $("#logina").val();
    var clavea = $("#clavea").val();

    $.ajax({
        url: "/api/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ logina: logina, clavea: clavea }),
        success: function () {
            // sesion iniciada -> al panel
            $(location).attr("href", "oferta.html");
        },
        error: function (xhr) {
            var msg = (xhr.responseJSON && xhr.responseJSON.error) || "Usuario y/o Password incorrectos";
            bootbox.alert(msg);
        }
    });
});
