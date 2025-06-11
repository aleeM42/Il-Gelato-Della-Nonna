const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Definir rutas
router.get("/", productoController.obtenerProductos);
router.post("/", productoController.agregarProducto);
router.delete("/:id", productoController.eliminarProducto);

module.exports = router;


