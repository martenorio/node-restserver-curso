const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();
const { verificarTokenimg } = require('../middleware/autenticacion');

app.get('/imagen/:tipo/:img', verificarTokenimg ,(req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;
    
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        let noImagepath = path.resolve(__dirname,'../assets/original.jpg');
        res.sendFile(noImagepath);
    }

})


module.exports = app;