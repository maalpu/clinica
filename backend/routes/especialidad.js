let express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Especialidad = require('../models/especialidad');


// ==========================================
// Obtener todas las especialidades
// ==========================================


app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Especialidad.find({})
        .skip(desde)
        .exec((err, especialidades) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando especialidad",
                    errors: err
                });
            }

            Especialidad.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    especialidades: especialidades,
                    total: conteo
                });
            });

        });

});

// ==========================================
// Actualizar una especialidad
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;


    Especialidad.findById(id, (err, especialidad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar la especialidad",
                errors: err
            });
        }

        if (!especialidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe la especialidad con id ' + id,
                errors: { message: 'No existe una especialidad con ese ID' }
            });
        }

        especialidad.nombre = body.nombre;

        especialidad.save((err, especialidadGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la especialidad',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                especialidad: especialidadGuardada
            });
        });
    });
});

// ==========================================
// Crear una especialidad
// ==========================================


app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let especialidad = new Especialidad({
        nombre: body.nombre
    });

    especialidad.save((err, especialidadGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar la especialidad',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            especialidad: especialidadGuardada
        });


    });

});


// ==========================================
// Eliminar una especialidad
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Especialidad.findByIdAndRemove(id, (err, especialidadBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar especialidad',
                errors: err
            });
        }

        if (!especialidadBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encuentra la especialidad con id ' + id,
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            especialidad: especialidadBorrada
        });
    });
});

module.exports = app;