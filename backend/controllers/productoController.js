const Producto = require("../models/Producto");

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.obtenerTodos();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.agregarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, imagen } = req.body;
        
        if (!nombre || !descripcion || !precio || !stock || !imagen) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const nuevoProducto = new Producto(null, nombre, descripcion, precio, stock, imagen);
        const insertId = await Producto.agregar(nuevoProducto);
        
        res.status(201).json({ 
            success: true,
            id: insertId,
            producto: nuevoProducto
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Producto.eliminarPorId(id);
        
        if (!eliminado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        
        res.json({ success: true, message: "Producto eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, imagen } = req.body;
        const { id } = req.params;

        if (!nombre || !descripcion || !precio || !stock || !imagen) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const productoActualizado = new Producto(id, nombre, descripcion, precio, stock, imagen);
        const actualizado = await Producto.actualizar(productoActualizado);

        if (!actualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({
            success: true,
            message: "Producto actualizado correctamente",
            producto: productoActualizado
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reducirStock = async (req, res) => {
    try {
        const { id } = req.params;
        let { cantidad } = req.body;

        cantidad = parseInt(cantidad);
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ mensaje: "Cantidad inválida" });
        }

        const [producto] = await Producto.obtenerTodos({ where: { id } });
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        if (producto.stock < cantidad) {
            return res.status(400).json({ 
                mensaje: `Stock insuficiente: disponible ${producto.stock}` 
            });
        }

        producto.stock -= cantidad;
        await Producto.actualizar(producto);

        res.json({ 
            mensaje: "Stock actualizado",
            nuevoStock: producto.stock
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
