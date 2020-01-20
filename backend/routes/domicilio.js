var express = require('express');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Domicilio = require('../models/domicilio');

// Obtener todos los domicilios
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Domicilio.find({})
        .populate('usuario', 'nombre email')
        .populate('localidad', "nombre provincia")

    .skip(desde)
        .limit(5)
        .exec(
            (err, domicilios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando domicilio',
                        errors: err
                    });
                }
                Domicilio.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        domicilios: domicilios,
                        total: conteo
                    });
                });
            });
});

// Actualizar domicilio
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Domicilio.findById(id, (err, domicilio) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar domicilio',
                errors: err
            });
        }
        if (!domicilio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El domicilio con el id ' + id + ' no existe',
                errors: { message: 'No existe un domicilio con ese ID' }
            });
        }
        domicilio.calle = body.calle;
        domicilio.numero = body.numero;
        domicilio.piso = body.piso;
        domicilio.departamento = body.departamento;
        domicilio.codPostal = body.codPostal;
        domicilio.usuario = req.usuario._id;
        domicilio.localidad = body.localidad;

        domicilio.save((err, domicilioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar domicilio',
                    errors: err
                });
            }
            domicilioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                domicilio: domicilioGuardado
            });
        });
    });
});

// Crear una nuevo domicilio
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var domicilio = new Domicilio({
        calle: body.calle,
        numero: body.numero,
        piso: body.piso,
        departamento: body.departamento,
        codPostal: body.codPostal,
        usuario: req.usuario._id,
        localidad: body.localidad
    });

    domicilio.save((err, domicilioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear domicilio',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            domicilio: domicilioGuardado,
            domiciliotoken: req.domicilio
        });
    });
});

// Borrar domicilio por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Domicilio.findByIdAndRemove(id, (err, domicilioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar domicilio',
                errors: err
            });
        }
        if (!domicilioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un domicilio con ese id',
                errors: { message: 'No existe un domicilio con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            domicilio: domicilioBorrado
        });
    });
});

module.exports = app;