const connection = require("../config/db");

class Producto {
    constructor(id, nombre, descripcion, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }

    static async obtenerTodos() {
        try {
            const [resultados] = await connection.query("SELECT * FROM productos");
            return resultados;
        } catch (error) {
            throw error;
        }
    }

    static async agregar(producto) {
        try {
            const [resultado] = await connection.query(
                "INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)",
                [producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.imagen]
            );
            return resultado.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async eliminarPorId(id) {
        try {
            const [resultado] = await connection.query("DELETE FROM productos WHERE id = ?", [id]);
            return resultado.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Producto;

