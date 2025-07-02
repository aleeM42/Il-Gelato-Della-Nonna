const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/consultarVentaController");

router.get("/", ventaController.getVentas);
router.get("/pendientes", ventaController.getVentasPendientes);
router.post("/guardardatos", ventaController.registrarVenta);
router.post("/pendiente", ventaController.registrarVentaPendiente);
router.post("/confirmar/:id", ventaController.confirmarVentaPendiente);
router.put("/modificar/:id", ventaController.modificarVenta);
router.delete("/eliminar/:id", ventaController.eliminarVenta);

module.exports = router;
