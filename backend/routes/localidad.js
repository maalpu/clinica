var express = require('express');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Localidad = require('../models/localidad');

// Obtener todas las localidades
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Localidad.find({})
        .populate('usuario', 'nombre email')
        .populate('provincia', 'nombre')
        .skip(desde)
        .limit(5)
        .exec(
            (err, localidades) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando localidad',
                        errors: err
                    });
                }
                Localidad.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        localidades: localidades,
                        total: conteo
                    });
                });
            });
});

// Actualizar localidad
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Localidad.findById(id, (err, localidad) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar localidad',
                errors: err
            });
        }
        if (!localidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La localidad con el id ' + id + ' no existe',
                errors: { message: 'No existe una localidad con ese ID' }
            });
        }
        localidad.nombre = body.nombre;
        localidad.codPostal = body.codPostal;
        localidad.usuario = req.usuario._id;
        localidad.provincia = body.provincia;

        localidad.save((err, localidadGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar localidad',
                    errors: err
                });
            }
            localidadGuardada.password = ':)';
            res.status(200).json({
                ok: true,
                localidad: localidadGuardada
            });
        });
    });
});

// Crear una nueva localidad
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var localidad = new Localidad({
        nombre: body.nombre,
        codPostal: body.codPostal,
        usuario: req.usuario._id,
        provincia: body.provincia
    });

    localidad.save((err, localidadGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear localidad',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            localidad: localidadGuardada,
            localidadtoken: req.localidad
        });
    });
});

// Borrar localidad por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Localidad.findByIdAndRemove(id, (err, localidadBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar localidad',
                errors: err
            });
        }
        if (!localidadBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una localidad con ese id',
                errors: { message: 'No existe una localidad con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            localidad: localidadBorrada
        });
    });
});

module.exports = app;