const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            err:{
                message:'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tiposValidos = ['productos','usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos permitidos: ' + tiposValidos.join(', '),
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.archivo;
    let nombreCortado = sampleFile.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]
    let extensionesValidadas = ['png', 'jpg','gif','jpeg'];

    if( extensionesValidadas.indexOf( extension ) < 0 ){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las extensiones permitidas son: ' + extensionesValidadas.join(', '),
                extension: extension
            }
        });
    } 

    //Cambiar nombre de archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        // imagen cargada en este punto 
        if(tipo == 'usuarios'){
            imagenUsuario(id,res, nombreArchivo);
        }else if(tipo == 'productos'){
            imagenProducto(id,res, nombreArchivo);
        }

        // res.json({
        //     ok:true,
        //     message: 'Archivo cargado'
        // });
    });
});

function imagenUsuario( id , res, nombreArchivo ){ 
    Usuario.findById(id, (err,usuarioDB)=>{
        if(err){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            })
        }
        borraArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            })
        })
    })
}
function imagenProducto(id , res, nombreArchivo){ 
    Producto.findById(id, (err,productoDB)=>{
        if(err){
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Producto no existe'
                }
            })
        }
        borraArchivo(productoDB.img,'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado)=>{
            res.json({
                ok:true,
                producto:productoGuardado,
                img:nombreArchivo
            })
        })
    })
}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
        //elimina el archivo para no tener repetidos 
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;