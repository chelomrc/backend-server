// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar Variables
var app = express();


// Conexion a la Base de Datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw error;
    console.log('Base de Datos:  \x1b[32m%s\x1b[0m', 'onLine');


});



// Rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        mensaje: 'Petición Realizada Correctamente'
    });

});


// Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'onLine');
});