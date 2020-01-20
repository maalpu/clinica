let express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Consultorio = require('../models/consultorio');

// ==========================================
// Obtener todos los consultorios
// ==========================================
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);



    Consultorio.find({})
        .skip(desde)
        .exec(
            (err, consultorios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando consultorios',
                        errors: err
                    });
                }

                Consultorio.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        consultorios: consultorios,
                        total: conteo
                    });
                });
            }
        );

});

app.get('/:id', (req, res, next) => {

    let desde = req.query.desde || 0;
    let id = req.params.id;
    desde = Number(desde);

    Consultorio.find({ _id: id })
        .skip(desde)
        .exec(
            (err, consultorios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando consultorios',
                        errors: err
                    });
                }

                Consultorio.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        consultorios: consultorios,
                        total: conteo
                    });
                });
            }
        );

});


// ==========================================
// Actualizar Consultorio
// ==========================================
app.put('/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Consultorio.findById(id, (err, consultorio) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar consultorio',
                errors: err
            });
        }

        if (!consultorio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El consultorio con el id ' + id + ' no existe.',
                errors: { message: 'No existe un consultorio con ese Id' }
            });
        }


        consultorio.area = body.area;
        consultorio.piso = body.piso;
        consultorio.numero = body.numero;

        consultorio.save((err, consultorioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el consultorio',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                consultorio: consultorioGuardado
            });
        });

    });

});



// ==========================================
// Crear un nuevo consultorio
// ==========================================
app.post('/', (req, res) => {

    let body = req.body;

    let consultorio = new Consultorio({
        area: body.area,
        piso: body.piso,
        numero: body.numero
    });

    consultorio.save((err, consultorioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear consultorio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            consultorio: consultorioGuardado
        });


    });

});


// ============================================
//   Borrar un consultorio por el id
// ============================================
app.delete('/:id', (req, res) => {

    let id = req.params.id;

    Consultorio.findByIdAndRemove(id, (err, consultorioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar consultorio',
                errors: err
            });
        }

        if (!consultorioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un consultorio con ese id',
                errors: { message: 'No existe un consultorio con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            consultorio: consultorioBorrado
        });

    });

});


module.exports = app;