var express = require('express');
var fileUpload = require('express-fileupload');

// fs = File System (permite eliminar archivos)
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección inválida',
            errors: { message: 'Debe ser: ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones son válidas
    var extesionesValidas = ['png', 'jpg', 'git', 'jpeg'];
    if (extesionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Formato de la imagen no válida',
            errors: { message: 'El formato de la imagen debe ser: ' + extesionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo desde un temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            // Verificar si el id existe
            if (!usuario) {
                elimiarArchivo(nombreArchivo, tipo);
                return res.status(400).json({
                    ok: true,
                    mensaje: 'No existe un usuario con ese ID',
                    errors: { message: `No existe un usuario con el id: ${id}` }
                });
            }

            var pathViejo = `./uploads/${tipo}/${usuario.img}`;

            // Si existe pathViejo, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo == 'medicos') {
        Medico.findById(id, (err, medico) => {
            // Verificar si el id existe
            if (!medico) {
                elimiarArchivo(nombreArchivo, tipo);
                return res.status(400).json({
                    ok: true,
                    mensaje: 'No existe un médico con ese ID',
                    errors: { message: `No existe un médico con el id: ${id}` }
                });
            }

            var pathViejo = `./uploads/${tipo}/${medico.img}`;

            // Si existe pathViejo, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }


    function elimiarArchivo(archivo, tipo) {
        var archivoAborrar = `./uploads/${tipo}/${archivo}`;
        return fs.unlinkSync(archivoAborrar);
    }

    module.exports = app;