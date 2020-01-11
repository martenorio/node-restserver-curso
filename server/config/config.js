//==========================================================
//  Puerto 
//==========================================================

process.env.PORT = process.env.PORT || 3000;




//==========================================================
//  Entorno 
//==========================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==========================================================
//  Vencimiento del token 
//==========================================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//==========================================================
//  SEED de autenticacion 
//==========================================================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo'

//==========================================================
//  Entorno 
//==========================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://curso:bEfTh3gHk3hjZVau@cluster0-uby7h.mongodb.net/test';
}

process.env.URLDB = urlDB;