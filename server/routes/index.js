const express = require('express');
const app = express();

// aqui se ingresan todas la routes que se agreguen
app.use(require('./usuario'))
app.use(require('./login'))

module.exports = app;