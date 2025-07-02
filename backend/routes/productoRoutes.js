const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Definir rutas
router.get("/", productoController.obtenerProductos);
router.post("/", productoController.agregarProducto);
router.put("/:id/reducir-stock", productoController.reducirStock);
router.delete("/:id", productoController.eliminarProducto);
router.put('/:id', express.json(), async (req, res) => {
    
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                error: "Cuerpo de solicitud vacío",
                solution: "Envía datos JSON válidos"
            });
        }

        await productoController.actualizarProducto(req, res);
    } catch (error) {
        console.error("Error en PUT /api/productos/:id", error);
        res.status(500).json({ 
            error: "Error interno del servidor",
            details: error.message
        });
    }
});
module.exports = router;


