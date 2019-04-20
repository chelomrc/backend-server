var express = require('express');

var app = express();
// Rutas
app.get('/', (request, response) => {

    response.status(200).json({
        ok: true,
        mensaje: 'Petición Realizada Correctamente'
    });

});

module.exports = app;