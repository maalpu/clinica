var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var domicilioSchema = new Schema({
    calle: { type: String, required: [true, 'La calle es necesaria'] },
    numero: { type: String, required: [true, 'El número es necesario'] },
    piso: { type: String },
    departamento: { type: String },
    codPostal: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    localidad: {
        type: Schema.Types.ObjectId,
        ref: 'Localidad',
        required: [true, 'El id de la localidad es un campo obligatorio ']
    }
});

module.exports = mongoose.model('Domicilio', domicilioSchema);