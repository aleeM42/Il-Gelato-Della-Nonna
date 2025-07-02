const db = require("../config/db");
const path = require("path");

exports.getVentas = async (req, res) => {
    const { buscar, fecha } = req.query;        /* extrae parametro :d*/
    try {
        let query = 'SELECT * FROM ventas WHERE 1=1';
        const params = [];
        if (buscar) {query += ' AND (cliente LIKE ? OR nOrden LIKE ?)';params.push(`%${buscar}%`, `%${buscar}%`);}   /*decision del usaurio si quiere buscar por nombre o numero de orden*/
        if (fecha) {query += ' AND fecha = ?';params.push(fecha);}    /*cuando el usuario eliga fecha */

        const [ventas] = await db.query(query, params);  /* cque vuelva los filtros cumplido*/
        const ventasFormateadas = ventas.map(v => {  /*que formatee la hora me lo pone feo :<*/
            const fechaFormateada = new Date(v.fecha).toISOString().split('T')[0];
            const horaFormateada = v.hora instanceof Date ? v.hora.toTimeString().slice(0, 5) : v.hora;
            return {...v, fecha: fechaFormateada, hora: horaFormateada};});
        res.json(ventasFormateadas);
    }
    catch (error) { /*cuando falle*/
        console.error('Error al consultar ventas:', error);
        res.status(500).json({ error: 'Error interno al consultar ventas' });
    }
};

// Validaciones
function validarNombre(user) {
    return /^[a-zA-Z\s]+$/.test(user);
}
function validarNumero(number) {
    return /^[0-9]+$/.test(number);
}
function validarOrden(orden) {
    return /^[a-zA-Z\s]+$/.test(orden);
}

// Controlador para registrar venta
exports.registrarVenta = async (req, res) => {
    try {
        const { user, number, orden, fecha, hora } = req.body;

        if (!validarNombre(user) || !validarNumero(number) || !validarOrden(orden)) {
            throw new Error("Uno de los campos fue llenado de forma incorrecta");
        }

        const values = [user, orden, fecha, hora, parseInt(number)];
        const query = `INSERT INTO ventas (cliente, pedido, fecha, hora, nOrden) VALUES (?)`;
        await db.query(query, [values]);

        res.redirect("/consultar-ventas");
    } catch (error) {
        console.error("❌ Error al guardar los datos:", error);
        res.status(500).render(path.join(__dirname, "../../frontend/views/ventas/registrarventas.ejs"), { error });
    }
};

exports.registrarVentaPendiente = async (req, res) => {
    try {
        const { numeroOrden, referencia, fecha, hora } = req.body;

        if (!numeroOrden || !referencia || !fecha || !hora) {
            return res.status(400).json({ mensaje: "Faltan campos requeridos" });
        }

        const query = `INSERT INTO ventas_pendientes (numero_orden, referencia, fecha, hora) VALUES (?, ?, ?, ?)`;
        await db.query(query, [numeroOrden, referencia, fecha, hora]);

        res.status(201).json({ mensaje: "Venta pendiente registrada" });
    } catch (err) {
        console.error("Error al registrar venta pendiente:", err);
        res.status(500).json({ mensaje: "Error interno", error: err.message });
    }
};

exports.getVentasPendientes = async (req, res) => {
    try {
        const [ventas] = await db.query("SELECT * FROM ventas_pendientes");
        res.json(ventas);
    } catch (err) {
        console.error("Error al obtener ventas pendientes:", err);
        res.status(500).json({ mensaje: "Error interno" });
    }
};

exports.confirmarVentaPendiente = async (req, res) => {
    const { id } = req.params;
    const { cliente, pedido } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM ventas_pendientes WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Pedido no encontrado" });

        const pendiente = rows[0];

        const valores = [
            cliente,
            pedido,
            pendiente.fecha,
            pendiente.hora,
            parseInt(pendiente.numero_orden.replace(/[^\d]/g, "")) // limpia el formato
        ];

        await db.query("INSERT INTO ventas (cliente, pedido, fecha, hora, nOrden) VALUES (?)", [valores]);
        await db.query("DELETE FROM ventas_pendientes WHERE id = ?", [id]);

        res.status(200).json({ mensaje: "Venta registrada y eliminada de pendientes" });
    } catch (err) {
        console.error("Error al confirmar venta:", err);
        res.status(500).json({ mensaje: "Error interno", error: err.message });
    }
};
    exports.modificarVenta = async (req, res) => {
    const { id } = req.params;
    const { cliente, pedido, fecha, hora, nOrden } = req.body;
    try {
        // Construir la consulta de actualización
        const query = `UPDATE ventas SET cliente = ?, nOrden = ?, fecha = ?, hora = ?, pedido = ? WHERE id = ?`;
        const params = [cliente, nOrden, fecha, hora, pedido, id]; // Asegúrate de incluir el pedido aquí
        await db.query(query, params);
        res.status(200).json({ mensaje: "Venta actualizada correctamente" });
    } catch (error) {
        console.error("Error al modificar la venta:", error);
        res.status(500).json({ mensaje: "Error interno" });
    }
};



exports.eliminarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM ventas WHERE id = ?", [id]);
        res.status(200).json({ mensaje: "Venta eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        res.status(500).json({ mensaje: "Error interno" });
    }
};
