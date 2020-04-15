const express = require('express');
let {verificarToken, verificaAdmin_Role} = require('../middleware/autenticacion');
let app = express();
let Categoria = require('../models/categoria');


app.get('/categoria',verificarToken, (req,res)=>{
    //-----------------------------
    //Mostrar todas las cattegorias
    //-----------------------------
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err,categorias) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            // Categoria.countDocuments((err,conteo)=>{
                res.json({
                    ok:true,
                    categorias,
                    // registros:conteo
                });
            // });
        });
})

app.get('/categoria/:id',verificarToken, (req,res)=>{
    //-----------------------------
    //Mostrar una cattegoria por ID
    //-----------------------------
    let id = req.params.id;
    Categoria.findById(id,(err,categorias) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!categorias){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'El id no es correcto'
                    }
                })
            }
            res.json({
                ok:true,
                categorias,
            });
    });
    //categoria find by ID

})

app.post('/categoria',verificarToken ,(req,res)=>{
    //----------------
    //Nueva cattegorias
    //-----------------
    // console.log(req);
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id 
    });
    categoria.save((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoriaDB,
            usuario: req.usuario._id
        })
    })
    //regresa la nueva categoria
    // regrsar id de la persona que hizo el registro 
    //req.usuario._id
})

app.put('/categoria/:id',verificarToken ,(req,res)=>{
    //-------------------------------------
    //Actualiza solo nombre de la categoria 
    //-------------------------------------
    let id = req.params.id;
    let body = req.body;
    // ._pick(req.body,['descripcion']); 
    let nuevaDescripcion = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id,nuevaDescripcion,{ new: true, runValidators: true },(err,categoriaUpdate)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!nuevaDescripcion){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            categoria:categoriaUpdate
        })
    })
})


app.delete('/categoria/:id',[verificarToken,verificaAdmin_Role] ,(req,res)=>{
    //------------------
    //Solo administrador 
    //------------------
    let id = req.params.id;
    Categoria.findOneAndRemove(id,(err,categoriaDelete)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        if(!categoriaDelete){
            return res.json(400).json({
                ok:false,
                error: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok:true,
            usuario:categoriaDelete
        })
    })
    //categoria.findByIdAndRemove
})


module.exports = app;