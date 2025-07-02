document.addEventListener("DOMContentLoaded", () => {
    const buscarInput = document.getElementById("buscarInput");
    const fechaInput = document.getElementById("fechaInput");
    const formulario = document.querySelector(".filtro");
    const tbody = document.querySelector("tbody");
    const formEditarVenta = document.getElementById("form-editar-venta");

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
            celda.colSpan = 5; // Cambiado a 5 para incluir la columna de acciones
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

            // Crear celda de acciones
            const acciones = document.createElement("td");
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-editar");
            btnEditar.onclick = () => abrirModalEditar(venta); // Llama a la función para abrir el modal
            acciones.appendChild(btnEditar);

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.onclick = () => eliminarVenta(venta.id); // Llama a la función para eliminar
            acciones.appendChild(btnEliminar);

            fila.appendChild(cliente);
            fila.appendChild(nOrden);
            fila.appendChild(fecha);
            fila.appendChild(hora);
            fila.appendChild(acciones); // Añadir la celda de acciones a la fila
            tbody.appendChild(fila);
        });
    }

    // Función para abrir el modal de edición
    function abrirModalEditar(venta) {
        document.getElementById("venta-id").value = venta.id;
        document.getElementById("venta-cliente").value = venta.cliente;
        document.getElementById("venta-orden").value = venta.nOrden;
        document.getElementById("venta-fecha").value = venta.fecha;
        document.getElementById("venta-hora").value = venta.hora;
        
        // Llenar el campo de pedido con el valor actual
        document.getElementById("venta-pedido").value = venta.pedido || ""; // Mantiene el valor actual o lo deja vacío
        document.getElementById("modal-venta").style.display = "flex";
    }

    // Evento para guardar cambios
    formEditarVenta.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("venta-id").value;
        const cliente = document.getElementById("venta-cliente").value;
        const nOrden = document.getElementById("venta-orden").value;
        const fecha = document.getElementById("venta-fecha").value;
        const hora = document.getElementById("venta-hora").value;
        const pedido = document.getElementById("venta-pedido").value; // Asegúrate de obtener el valor del pedido

        try {
            await fetch(`/api/ventas/modificar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cliente, nOrden, fecha, hora, pedido }) // Asegúrate de incluir el pedido aquí
            });
            // Actualizar la tabla después de modificar
            formulario.dispatchEvent(new Event("submit"));
            document.getElementById("modal-venta").style.display = "none";
        } catch (error) {
            console.error("Error al modificar la venta:", error);
        }
    });


    // Función para eliminar venta
    async function eliminarVenta(id) {
        if (confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
            try {
                await fetch(`/api/ventas/eliminar/${id}`, {
                    method: "DELETE"
                });
                // Actualizar la tabla después de eliminar
                formulario.dispatchEvent(new Event("submit"));
            } catch (error) {
                console.error("Error al eliminar la venta:", error);
            }
        }
    }

    formulario.dispatchEvent(new Event("submit"));
});
