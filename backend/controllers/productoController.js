const db = require("../config/db");
const { Producto } = require("../models/Producto");

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const [productos] = await db.query("SELECT * FROM productos");
        res.json(productos);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ mensaje: "Error al obtener productos", error: err });
    }
};

// Agregar un nuevo producto
exports.agregarProducto = async (req, res) => {
    console.log("Datos recibidos en agregarProducto:", req.body);

    const { nombre, descripcion, precio, stock, imagen } = req.body;
    if (!nombre || !descripcion || !precio || !stock || !imagen) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        const [resultado] = await db.query(
            "INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, precio, stock, imagen]
        );
        res.status(201).json({ id: resultado.insertId, nombre, descripcion, precio, stock, imagen });
    } catch (err) {
        console.error("Error al agregar producto:", err);
        res.status(500).json({ mensaje: "Error al agregar producto", error: err });
    }
};

// Eliminar producto por ID
exports.eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.query("DELETE FROM productos WHERE id = ?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar producto:", err);
        res.status(500).json({ mensaje: "Error al eliminar producto", error: err });
    }
};

//Reducir el stock
exports.reducirStock = async (req, res) => {
    const { id } = req.params;
    let { cantidad } = req.body;

    // Verifica que cantidad sea un número entero válido
    cantidad = parseInt(cantidad);
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({ mensaje: "Cantidad inválida para reducir stock" });
    }

    try {
        // Consultar el producto y su stock actual
        const [resultado] = await db.query("SELECT stock FROM productos WHERE id = ?", [id]);
        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        const stockActual = parseInt(resultado[0].stock);

        if (stockActual < cantidad) {
            return res.status(400).json({ mensaje: `Stock insuficiente: disponible ${stockActual}, solicitado ${cantidad}` });
        }

        const nuevoStock = stockActual - cantidad;

        // Actualizar el stock en la base de datos
        await db.query("UPDATE productos SET stock = ? WHERE id = ?", [nuevoStock, id]);

        res.status(200).json({ mensaje: "Stock actualizado correctamente", stockAnterior: stockActual, stockNuevo: nuevoStock });

    } catch (error) {
        console.error("🛑 Error al reducir stock:", error);
        res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
    }
};