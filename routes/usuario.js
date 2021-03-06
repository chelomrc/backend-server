var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ===================================
// Obtener todos los Usuarios
// ===================================

app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                response.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });
});








// ===================================
// Actualizar usuario
// ===================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el error con el usuario' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = '****';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});






// ===================================
// Crear un nuevo usuario
// ===================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;


    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    if (!body.password) {
        usuario.password = null;
    } else {
        usuario.password = bcrypt.hashSync(body.password, 10);
    }

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});

// ===================================
// Borrar un usuario por ID
// ===================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports = app;