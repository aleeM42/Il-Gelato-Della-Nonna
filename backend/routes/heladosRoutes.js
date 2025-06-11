const express = require("express");
const router = express.Router();

// Rutas para vistas
router.get("/catalogo", (req, res) => {
    res.render("catalogo");
});

router.get("/helados", (req, res) => {
    res.render("helados");
});


module.exports = router;