var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var consultorioSchema = new Schema({
    area: { type: String, required: [true, 'El area es necesario'] },
    piso: { type: String, required: [true, 'El piso es necesario'] },
    numero: { type: Number, required: [true, 'El número es necesario'] }
}, { collection: 'consultorios' });

module.exports = mongoose.model('Consultorio', consultorioSchema);