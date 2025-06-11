document.addEventListener("DOMContentLoaded", () => {
    const buscarInput = document.getElementById("buscarInput");
    const fechaInput = document.getElementById("fechaInput");
    const formulario = document.querySelector(".filtro");
    const tbody = document.querySelector("tbody");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const buscar = buscarInput.value.trim();
        const fecha = fechaInput.value;
        let url = "/api/ventas";
        const params = new URLSearchParams();
        if (buscar) params.append("buscar", buscar);
        if (fecha) params.append("fecha", fecha);
        if (params.toString()) url += "?" + params.toString();
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            llenarTabla(datos);
        } catch (error) {
            console.error("Error al consultar ventas:", error);
        }
    });

    function llenarTabla(ventas) {
        tbody.innerHTML = "";

        if (ventas.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.colSpan = 4;
            celda.textContent = "No hay resultados";
            fila.appendChild(celda);
            tbody.appendChild(fila);
            return;
        }
        ventas.forEach((venta) => {
            const fila = document.createElement("tr");
            const cliente = document.createElement("td");
            cliente.textContent = venta.cliente;
            const nOrden = document.createElement("td");
            nOrden.textContent = venta.nOrden;
            const fecha = document.createElement("td");
            fecha.textContent = venta.fecha;
            const hora = document.createElement("td");
            hora.textContent = venta.hora;
            fila.appendChild(cliente);
            fila.appendChild(nOrden);
            fila.appendChild(fecha);
            fila.appendChild(hora);
            tbody.appendChild(fila);
        });
    }
    formulario.dispatchEvent(new Event("submit"));
});