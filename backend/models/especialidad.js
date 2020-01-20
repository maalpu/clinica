let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let especialidadSchema = new Schema({

    nombre: { type: String, required: [true, 'La especialidad es necesaria'] }
});



module.exports = mongoose.model('Especialidad', especialidadSchema);