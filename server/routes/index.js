const express = require('express');
const app = express();

// aqui se ingresan todas la routes que se agreguen
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./categorias'))
app.use(require('./productos'))

module.exports = app;