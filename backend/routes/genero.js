let express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Genero = require('../models/genero');


// ==========================================
// Obtener todas las generoes
// ==========================================


app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Genero.find({})
        .skip(desde)
        .exec((err, generos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando genero",
                    errors: err
                });
            }

            Genero.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    generos: generos,
                    total: conteo
                });
            });

        });

});

// ==========================================
// Actualizar una genero
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;


    Genero.findById(id, (err, genero) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar la genero",
                errors: err
            });
        }

        if (!genero) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe la genero con id ' + id,
                errors: { message: 'No existe una genero con ese ID' }
            });
        }

        genero.nombre = body.nombre;

        genero.save((err, generoGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la genero',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                genero: generoGuardada
            });
        });
    });
});

// ==========================================
// Crear una genero
// ==========================================


app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let genero = new Genero({
        nombre: body.nombre
    });

    genero.save((err, generoGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar la genero',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            genero: generoGuardada
        });


    });

});


// ==========================================
// Eliminar una genero
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Genero.findByIdAndRemove(id, (err, generoBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar genero',
                errors: err
            });
        }

        if (!generoBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encuentra la genero con id ' + id,
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            genero: generoBorrada
        });
    });
});

module.exports = app;