// Requires
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
const cors = require('cors');

// Inicializar variables
let app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors permite que le hagamos peticiones al server desde el front
app.use(cors());


// Importar rutas
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');
let consultorioRoutes = require('./routes/consultorio');
let especialidadRoutes = require('./routes/especialidad');
let provinciaRoutes = require('./routes/provincia');
let localidadRoutes = require('./routes/localidad');
let domicilioRoutes = require('./routes/domicilio');
let generoRoutes = require('./routes/genero');
let busquedaRoutes = require('./routes/busqueda');
//let uploadRoutes = require('./routes/upload');
//let imagenesRoutes = require('./routes/imagenes');
let errorbdRoutes = require('./routes/errorbd');


// Conexión a la base de datos
// { useNewUrlParser: true, useUnifiedTopology: true } fix deprecated warnings
mongoose.connection.openUri('mongodb://localhost:27017/curaeDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/consultorio', consultorioRoutes);
app.use('/especialidad', especialidadRoutes);
app.use('/provincia', provinciaRoutes);
app.use('/localidad', localidadRoutes);
app.use('/domicilio', domicilioRoutes);
app.use('/errorbd', errorbdRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/genero', generoRoutes);
//app.use('/upload', uploadRoutes);
//app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});