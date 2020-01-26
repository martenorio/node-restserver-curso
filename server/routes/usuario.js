const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const {verificarToken , verificaAdmin_Role} = require('../middleware/autenticacion')
const app = express();

app.get('/usuario', verificarToken ,(req, res) => {
    //res.json('Get usuario local');

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                    //o tambien err:err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        })

})

app.post('/usuario', [verificarToken, verificaAdmin_Role],function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
                //o tambien err:err
            });
        }
        usuarioBD.password = null;
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    })



})

app.put('/usuario/:id', [verificarToken, verificaAdmin_Role],function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
                //o tambien err:err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    })

})

app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role],function(req, res) {
    let id = req.params.id;
    let cambiaestado = {
        estado: false
    }

    /*Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioborrado
        })
    })*/
    //las tecnicas de borrar un registro en la actualidad solo ponen en un estado que no esta disponible para el usuario

    Usuario.findByIdAndUpdate(id, cambiaestado, (err, usuarioborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioborrado
        })
    })

})

module.exports = app;