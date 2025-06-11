class Venta {
    constructor(cliente, nOrden,fecha,hora,pedido) {
        this.cliente = cliente;
        this.nOrden = nOrden;
        this.fecha = fecha;
        this.hora = hora;
        this.pedido = pedido;
    }
}

/* const ventas = [
    new Venta("Valentina Da Camara", "AA002","2025-05-20",  "12:30:00"),
    new Venta("Pedro Da Silva", "AA003","2025-06-21", "08:30:00"),
    new Venta("María González", "AA004","2025-05-21","08:30:00" )
];

*/


module.exports = { Venta};
