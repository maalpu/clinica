var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinciaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Provincia', provinciaSchema);