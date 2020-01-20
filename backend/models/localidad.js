var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var localidadSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    codPostal: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    provincia: {
        type: Schema.Types.ObjectId,
        ref: 'Provincia',
        required: [true, 'El id provincia es un campo obligatorio ']
    }
});

module.exports = mongoose.model('Localidad', localidadSchema);