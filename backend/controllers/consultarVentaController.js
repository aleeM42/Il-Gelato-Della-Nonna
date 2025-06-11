const db = require("../config/db");

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