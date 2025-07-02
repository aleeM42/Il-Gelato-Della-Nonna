// models/Producto.js
const db = require("../config/db");

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
            const [resultados] = await db.query("SELECT * FROM productos");
            return resultados;
        } catch (error) {
            console.error("Error en Producto.obtenerTodos:", error);
            throw error;
        }
    }

    static async agregar(producto) {
        try {
            const [resultado] = await db.query(
                "INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)",
                [producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.imagen]
            );
            return resultado.insertId;
        } catch (error) {
            console.error("Error en Producto.agregar:", error);
            throw error;
        }
    }

    static async eliminarPorId(id) {
        try {
            const [resultado] = await db.query("DELETE FROM productos WHERE id = ?", [id]);
            return resultado.affectedRows > 0;
        } catch (error) {
            console.error("Error en Producto.eliminarPorId:", error);
            throw error;
        }
    }

    static async actualizar(producto) {
        try {
            const [resultado] = await db.query(
                "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ? WHERE id = ?",
                [producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.imagen, producto.id]
            );
            return resultado.affectedRows > 0;
        } catch (error) {
            console.error("Error en Producto.actualizar:", error);
            throw error;
        }
    }
}

module.exports = Producto;
