var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var generoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
});

module.exports = mongoose.model('Genero', generoSchema);