const express = require('express');
const router = express.Router();
const { crearPerfil, iniciarSesion, obtenerPerfil, eliminarPerfil, actualizarPerfil } = require('../controllers/controladorUsuario');

// Registrar usuario
router.post('/registrar', async (req, res) => {
    const { nombre, email, cedula, password, phone } = req.body;

    try {
        const resultado = await crearPerfil(nombre, email, cedula, password, phone);
        if (resultado.exito) {
            res.status(200).json(resultado);
        } else {
            res.status(400).json(resultado);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const resultado = await iniciarSesion(email, password);
        if (resultado.exito) {
            res.status(200).json(resultado);
        } else {
            res.status(401).json(resultado);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
    }
});

router.get('/perfil/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const resultado = await obtenerPerfil(email);
        if (resultado) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error al obtener el perfil' });
    }
});
router.put('/perfil/:email', async (req, res) => {
    const resultado = await actualizarPerfil(req.params.email, req.body);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});

router.delete('/perfil/:email', async (req, res) => {
    const resultado = await eliminarPerfil(req.params.email);
    res.status(resultado.exito ? 200 : 400).json(resultado);
});
module.exports = router;