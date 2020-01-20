var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var erroresbdSchema = new Schema({
    fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
    detalle: { type: String, required: [true, 'El detalle es necesario'] },
    solucion: { type: String },
    reparado: { type: Boolean, default: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'erroresbd' });

module.exports = mongoose.model('Errorbd', erroresbdSchema);