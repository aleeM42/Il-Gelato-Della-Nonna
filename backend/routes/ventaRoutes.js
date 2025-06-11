const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/consultarVentaController");

router.get("/", ventaController.getVentas);

module.exports = router;