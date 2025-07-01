const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/consultarVentaController");

router.get("/", ventaController.getVentas);
router.get("/pendientes", ventaController.getVentasPendientes);
router.post("/guardardatos", ventaController.registrarVenta);
router.post("/pendiente", ventaController.registrarVentaPendiente);
router.post("/confirmar/:id", ventaController.confirmarVentaPendiente);

module.exports = router;
