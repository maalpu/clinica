var express = require('express');
var app = express();

var Consultorio = require('../models/consultorio');
var Domicilio = require('../models/domicilio');
var Localidad = require('../models/localidad');
var Provincia = require('../models/provincia');
var Especialidad = require('../models/especialidad');
var Usuario = require('../models/usuario');

// Búsqueda por colección
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'consultorios':
            promesa = buscarConsultorios(busqueda, regex)
            break;
        case 'domicilios':
            promesa = buscarDomicilios(busqueda, regex)
            break;
        case 'especialidades':
            promesa = buscarEspecialidades(busqueda, regex)
            break;
        case 'localidades':
            promesa = buscarLocalidades(busqueda, regex)
            break;
        case 'provincias':
            promesa = buscarProvincias(busqueda, regex)
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda válidos son: consultorios, domicilios, especialidades, localidades, provincias y usuarios',
                error: { message: 'Tipo de tabla/colección no válida' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// Búsqueda general
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarConsultorios(busqueda, regex),
            buscarDomicilios(busqueda, regex),
            buscarEspecialidades(busqueda, regex),
            buscarLocalidades(busqueda, regex),
            buscarProvincias(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                consultorios: respuestas[0],
                especialidades: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarConsultorios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Consultorio.find({}, 'area piso numero')
            .populate('usuario', 'nombre email')
            .exec((err, consultorios) => {
                if (err) {
                    reject('Error al cargar consultorios', err);
                } else {
                    resolve(consultorios);
                }
            });
    });
}

function buscarDomicilios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Domicilio.find({}, 'calle numero piso departamento codPostal')
            .populate('usuario', 'nombre email')
            .populate('localidad', 'nombre')
            .populate('provincia', 'nombre')
            .exec((err, domicilios) => {
                if (err) {
                    reject('Error al cargar domicilios', err);
                } else {
                    resolve(domicilios);
                }
            });
    });
}

function buscarEspecialidades(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Especialidad.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('consultorio', 'nombre')
            .exec((err, especialidades) => {
                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(especialidades);
                }
            });
    });
}

function buscarLocalidades(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Localidad.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('provincia', 'nombre')
            .exec((err, localidades) => {
                if (err) {
                    reject('Error al cargar localidades', err);
                } else {
                    resolve(localidades);
                }
            });
    });
}

function buscarProvincias(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Provincia.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, provincias) => {
                if (err) {
                    reject('Error al cargar provincias', err);
                } else {
                    resolve(provincias);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

// Función de búsqueda de Usuarios por el nombre
/*function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({ nombre: regex }, (err, usuarios) => {
            if (err) {
                reject('Error al cargar médicos', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}*/


module.exports = app;