var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Errordb = require('../models/errorbd');

// Obtener todos los erroresbd
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Errordb.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, erroresbd) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando errorbd',
                        errors: err
                    });
                }
                Errordb.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        erroresbd: erroresbd,
                        total: conteo
                    });
                });
            });
});

// Actualizar errorbd
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Errordb.findById(id, (err, errorbd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar errorbd',
                errors: err
            });
        }
        if (!errorbd) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El errorbd con el id ' + id + ' no existe',
                errors: { message: 'No existe un errorbd con ese ID' }
            });
        }
        errorbd.fecha = body.fecha;
        errorbd.detalle = body.detalle;
        errorbd.solucion = body.solucion;
        errorbd.reparado = body.reparado;
        errorbd.usuario = req.usuario._id;

        errorbd.save((err, errorbdGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar errorbd',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                errorbd: errorbdGuardado
            });
        });
    });
});

// Crear un nuevo errorbd
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var errorbd = new Errordb({
        fecha: body.fecha,
        detalle: body.detalle,
        solucion: body.solucion,
        reparado: body.reparado,
        usuario: req.usuario._id
    });

    errorbd.save((err, errorbdGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear errorbd',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            errorbd: errorbdGuardado
        });
    });
});

// Borrar errorbd por el id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Errordb.findByIdAndRemove(id, (err, errorbdBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar errorbd',
                errors: err
            });
        }
        if (!errorbdBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un errorbd con ese id',
                errors: { message: 'No existe un errorbd con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            errorbd: errorbdBorrado
        });
    });
});

module.exports = app;