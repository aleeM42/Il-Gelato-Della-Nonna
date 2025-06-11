const Producto = require("../models/Producto");

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.obtenerTodos();
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

    const nuevoProducto = new Producto(null, nombre, descripcion, precio, stock, imagen);

    try {
        const insertId = await Producto.agregar(nuevoProducto);
        res.status(201).json({ id: insertId, nombre, descripcion, precio, stock, imagen });
    } catch (err) {
        console.error("Error al agregar producto:", err);
        res.status(500).json({ mensaje: "Error al agregar producto", error: err });
    }
};

// Eliminar producto por ID
exports.eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const eliminado = await Producto.eliminarPorId(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar producto:", err);
        res.status(500).json({ mensaje: "Error al eliminar producto", error: err });
    }
};