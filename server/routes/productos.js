const express = require('express');
const {verificarToken, verificaAdmin_Role} = require('../middleware/autenticacion');

let app = express();
let Producto = require('../models/producto');


//============================
// Obtener todos los productos
//============================
app.get('/productos',verificarToken,(req,res)=>{
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible:true},'')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err,productos) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            Producto.countDocuments({disponible:true},(err,conteo)=>{
                res.json({
                    ok:true,
                    productos,
                    registros:conteo
                })
            })
        })

})


//============================
// Obtener producto por id
//============================
app.get('/productos/:id',verificarToken,(req,res)=>{
    // populate: usuario categoria
    // paginado
    let id = req.params.id;
    Producto.findById(id,(err,producto)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!producto){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El id no es correcto'
                }
            })
        }
        res.jsonp({
            ok:true,
            producto
        })
    })
})


//============================
// Buscar un producto
//============================
app.get('/productos/buscar/:termino',verificarToken,(req,res)=>{

    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');

    Producto.find({nombre:regex})
    .populate('categoria','nombre')
    .exec((err,ProductoBDbusqueda)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:false,
            producto:ProductoBDbusqueda
        })
    })
})


//============================
// Crear un nuevo producto
//============================
app.post('/productos',verificarToken,(req,res)=>{
    // grabar el usuario
    // grabar la categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precio,
        descripcion : body.descripcion,
        categoria : body.categoria,
        usuario : req.usuario._id
    })
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok: true,
            producto:productoDB,
            usuario: req.usuario._id
        })
    })
})


//============================
// Actualizar un nuevo producto
//============================
app.put('/productos/:id',verificarToken,(req,res)=>{
    // grabar el usuario
    // grabar la categoria del listado
    let id = req.params.id;
    let body = req.body;
    let nuevoProducto = {
        nombre : body.nombre,
        precioUni : body.precio,
        descripcion : body.descripcion,
        categoria : body.categoria,
        usuario : req.usuario._id
    }
    Producto.findById(id,(err,productoUpdate)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoUpdate){
            return res.status(400).json({
                ok:true,
                err: {
                    message: 'El id del producto no existe'
                }
            })
        }
        productoUpdate.nombre = body.nombre
        productoUpdate.precioUni = body.precio
        productoUpdate.descripcion = body.descripcion
        productoUpdate.categoria = body.categoria
        productoUpdate.disponible = body.disponible
        
        productoUpdate.save((err,productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok: true,
                producto:productoDB,
                usuario: req.usuario._id
            })
        })
    })
})


//============================
// Eliminar un nuevo 
//============================
app.delete('/productos/:id',verificarToken,(req,res)=>{
    // cambiar el diponoble a falso
    let id = req.params.id;
    let bajaProducto = {
        disponible : false
    }
    Producto.findByIdAndUpdate(id,bajaProducto,{ new: true, runValidators: true },(err,productoUpdate)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoUpdate){
            return res.status(400).json({
                ok:true,
                err
            })
        }
        res.json({
            ok:true,
            producto: productoUpdate,
            message:'Producto borrado'
        })
    })
})


module.exports = app;