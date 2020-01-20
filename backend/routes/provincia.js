var express = require('express');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Provincia = require('../models/provincia');

// Obtener todas los provincias
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Provincia.find({})
        .populate('usuario', 'nombre email')
        .populate('localidad', 'nombre codPostal')
        .skip(desde)
        .limit(5)
        .exec(
            (err, provincias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando provincia',
                        errors: err
                    });
                }
                Provincia.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        provincias: provincias,
                        total: conteo
                    });
                });
            });
});

// Actualizar provincia
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Provincia.findById(id, (err, provincia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar provincia',
                errors: err
            });
        }
        if (!provincia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La provincia con el id ' + id + ' no existe',
                errors: { message: 'No existe una provincia con ese ID' }
            });
        }
        provincia.nombre = body.nombre;
        provincia.usuario = req.usuario._id;

        provincia.save((err, provinciaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar provincia',
                    errors: err
                });
            }
            provinciaGuardada.password = ':)';
            res.status(200).json({
                ok: true,
                provincia: provinciaGuardada
            });
        });
    });
});

// Crear una nueva provincia
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var provincia = new Provincia({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    provincia.save((err, provinciaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear provincia',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            provincia: provinciaGuardada,
            provinciatoken: req.provincia
        });
    });
});

// Borrar provincia por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Provincia.findByIdAndRemove(id, (err, provinciaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar provincia',
                errors: err
            });
        }
        if (!provinciaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una provincia con ese id',
                errors: { message: 'No existe una provincia con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            provincia: provinciaBorrada
        });
    });
});

module.exports = app;