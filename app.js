const express = require("express");
const path = require("path");
const productoRoutes = require("./backend/routes/productoRoutes");
const ventaRoutes = require("./backend/routes/ventaRoutes");
const usuariosRoutes = require("./backend/routes/usuariosRoutes");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require('mysql2');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend", "views"));

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" })); // este es el que importa
app.use(bodyParser.json()); // opcional si ya usas express.json()

//Rutas backend
app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/usuarios", usuariosRoutes);


// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "frontend/public")));

//Ruta para servir la pagina de inicio
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "views", "index.html"));
});

//ruta para servir la pagina de login
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "views", "perfil", "login.html"));
});

//ruta para servir la pagina de sign up
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "views", "perfil", "signup.html"));
});

// Ruta para servir la página de consultar ventas
app.get("/consultar-ventas", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "views","ventas", "consultarVenta.html"));
});

// Ruta para ver catalogo
app.get("/catalogo", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "views", "carrito","catalogo.html"));
});

//Ruta para ver heladosAdmin
app.get("/helados", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "views", "helados", "helados.html"));
});

// servir registrar ventas
app.get("/registrar-ventas", (req, res) => {
    res.render("ventas/registrarventas");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
