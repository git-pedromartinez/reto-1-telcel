const express = require('express');
const app = express();

//bases de datos
const mongoose = require('mongoose');
const key_mongodb = require('./config/mongodb')
mongoose.connect(`mongodb+srv://${key_mongodb.user}:${key_mongodb.password}@cluster0.gvxaq.mongodb.net/telcel?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//tools
const path = require('path')
const fs = require('fs');

// middlewares
const morgan = require('morgan');
app.use(morgan('dev'));

//settings para recibir y enviar en fotmato json
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//configuración del puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor inicializado con éxito en el puerto [${port}]`);
});

//archivos estáticos (públicos)
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/assets', express.static(path.join(__dirname, '/public/assets')));

//views (motore de vista ejs)
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//rutas de la página
const routes = require('./routes');
routes(app);