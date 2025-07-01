// Variables globales
let productosDB = [];  // Productos obtenidos desde la base de datos
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const listaProductos = document.getElementById("listaProductos");
const cartAside = document.getElementById("cartAside");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");


////////// USUARIOOO CARRITO CLIENTE //////////////

// Renderizar productos en la tienda
async function cargarProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/productos");
        if (!respuesta.ok) {
            console.error(`Error en la API: ${respuesta.status} - ${respuesta.statusText}`);
            return;
        }
        const data = await respuesta.json();
        if (Array.isArray(data)) {
            productosDB = data;
            renderProductos(productosDB);
        } else {
            console.error("La respuesta de la API no es una lista válida.");
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

function renderProductos(productos) {
    listaProductos.innerHTML = "";
    if (!Array.isArray(productos) || productos.length === 0) {
        listaProductos.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    productos.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio); // Convertir a número
        if (isNaN(precioNumerico)) {
            console.warn(`El precio del producto con ID ${producto.id} no es válido.`);
            return;
        }

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
      <div class="image">
          <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="item-name">
          <h3>${producto.nombre}</h3>
      </div>
      <div class="item-price">
          <p>$${precioNumerico.toFixed(2)}</p>
      </div>
      <div>
          <button onclick="agregarAlCarrito(${producto.id})">
              <span class="material-symbols-outlined add-cart">add_shopping_cart</span>
          </button>
      </div>
      <div style="display: none">
          <span>${producto.descripcion}</span>  
      </div>
    `;
        listaProductos.appendChild(div);
    });
}

// Listener para filtrar productos en tiempo real
searchInput.addEventListener("input", (e) => {
    const filtro = e.target.value.trim().toLowerCase();
    const productosFiltrados = productosDB.filter(producto =>
        producto.nombre.toLowerCase().includes(filtro)
    );
    renderProductos(productosFiltrados);
});

document.getElementById("toggleCart").addEventListener("click", () => {
    cartAside.classList.toggle("active");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartAside.classList.remove("active");
});

// Renderizar productos del carrito
function renderizarCarrito() {
    cartItems.innerHTML = "";
    cartCount.innerText = "0";

    if (carrito.length === 0) {
        cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        carrito.forEach((producto, index) => {
            const precioNumerico = parseFloat(producto.precio);
            if (isNaN(precioNumerico)) {
                console.warn(`El precio del producto con ID ${producto.id} no es válido.`);
                return;
            }

            const fila = document.createElement("div");
            fila.classList.add("fila");
            fila.innerHTML = `
                <div>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div>${producto.nombre}
                </div>
                <div style="display: none">${producto.descripcion}
                </div>
                <div class="item-price">$${precioNumerico.toFixed(2)}
                </div>
                <div class="cont-cant">
                    <input class="counter-cantidad" type="number" min="1" value="${producto.cantidad}" onchange="actualizarCantidad(${index}, this.value)">
                </div>
                <div>
                    <button onclick="eliminarDelCarrito(${index})" class="button">
                        <span class="material-symbols-outlined icon-remove">close</span>
                    </button>
                </div>
            `;
            cartItems.appendChild(fila);
        });
    }

    actualizarCantidadCarrito();
    actualizarTotal();
    //localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito
window.agregarAlCarrito = function (id) {
    // Buscar el producto en la base de datos cargada
    const producto = productosDB.find(p => p.id === id);
    if (!producto) {
        showAlert("Producto no encontrado", 'error');
        return;
    }
    // Verificar stock disponible
    if (producto.stock === 0) {
        showAlert("No hay stock disponible para este helado", 'error');
        return;
    }
    // Reducir stock localmente

    // Buscar si ya existe en el carrito
    const existente = carrito.find(p => p.id === id);
    if (existente) {
        showAlert("El helado ya se encuentra en el carrito", 'error');
        return;
    } else {
        producto.stock--;
        carrito.push({ ...producto, cantidad: 1 });
        showAlert("Producto añadido al carrito", 'success');
    }
    renderizarCarrito();
};

function actualizarCantidadCarrito() {
    const totalItems = carrito.reduce((sum, prod) => sum + prod.cantidad, 0);
    cartCount.innerText = totalItems;
}

// Actualizar cantidad de producto en el carrito
window.actualizarCantidad = function (index, cantidad) {
    carrito[index].cantidad = parseInt(cantidad) || 0;
    renderizarCarrito();
};

// Eliminar producto
window.eliminarDelCarrito = function (index) {
    carrito.splice(index, 1);
    renderizarCarrito();
};

// Calcular total
function actualizarTotal() {
    const total = carrito.reduce((sum, prod) => sum + (prod.precio * prod.cantidad), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Vaciar carrito
document.getElementById("emptyCart").addEventListener("click", () => {

    if (carrito.length === 0) {
        showAlert("El carrito ya está vacío. ¡Añade algunos helados deliciosos!",'error');
    } else {
        carrito.length = 0;
        renderizarCarrito();
        showAlert("Haz vaciado tu carrito, vuelve pronto!", 'success');
    }
});

function showAlert(message, type) {
    const nonRepeatAlert = document.querySelector('.alert');
    if (nonRepeatAlert) nonRepeatAlert.remove();
    const div = document.createElement('div');
    div.classList.add('alert', type);
    div.innerHTML = message;
    document.body.appendChild(div);

    setTimeout(() => {
        div.style.transition = "opacity 0.5s ease-in-out";
        div.style.opacity = "0";
    }, 2500);

    setTimeout(() => {
        div.remove(); // Elimina el div después de que se desvanezca completamente
    }, 3000);
}

// Cargar carrito inicial
function iniciarApp() {
    renderizarCarrito();  // Renderizamos el carrito con lo que haya guardado
    cargarProductos();    // Cargamos los productos desde la base de datos
}

function togglePerfil() {
    const perfilModal = document.getElementById("perfilModal");

    if (perfilModal.style.display === "flex") {
        perfilModal.style.display = "none"; // Oculta el modal al hacer clic en cerrar
    } else {
        perfilModal.style.display = "flex"; // Muestra el modal
        loadPerfil();
    }
}

async function loadPerfil() {
    const email = localStorage.getItem("email");
    if (!email) {
        alert("No se encontró la información del usuario. Por favor inicia sesión.");
        window.location.href = "/login";
        return;
    }

    try {
        const res = await fetch(`/api/usuarios/perfil/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Error al consultar perfil");

        const data = await res.json();

        // Asignamos los datos obtenidos a los elementos del modal
        document.getElementById("nombre").textContent = data.nombre;
        document.getElementById("email").textContent = data.email;
        document.getElementById("cedula").textContent = data.cedula;
        document.getElementById("password").textContent = data.password;
        document.getElementById("phone").textContent = data.phone;

    } catch (err) {
        console.error(err);
        alert("Error al cargar los datos del perfil");
    }
}

//FINALIZAR PEDIDO
document.getElementById("finalizarBuy").addEventListener("click", () => {
    mostrarResumenPedido();
    console.log("Botón Finalizar Compra clickeado");
    const modal = document.getElementById("modalPedido");
    modal.style.display = "flex";

  });

function mostrarResumenPedido() {
    const contenedor = document.getElementById("detallePedido");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    let total = 0;
    const lista = document.createElement("ul");
    lista.style.paddingLeft = "1em";

    carrito.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio);
        const subtotal = precioNumerico * producto.cantidad;
        total += subtotal;

        const item = document.createElement("li");
        item.textContent = `${producto.cantidad}x ${producto.nombre} - $${subtotal.toFixed(2)}`;
        lista.appendChild(item);
    });

    contenedor.appendChild(lista);

    const totalParrafo = document.createElement("p");
    totalParrafo.style.fontWeight = "bold";
    totalParrafo.textContent = `Total: $${total.toFixed(2)}`;
    contenedor.appendChild(totalParrafo);
}


document.getElementById("confirmarPedidoBtn").addEventListener("click", async () => {

    const refInput = document.getElementById("refPago");
    const referencia = refInput.value.trim();
    const mensajeOrden = document.getElementById("ordenGenerada");

    // Validación: exactamente 4 dígitos
    if (!/^\d{4}$/.test(referencia)) {
        refInput.focus();
        showAlert("Debes ingresar una referencia válida de 4 dígitos", 'error');
        return;
    }

    if (carrito.length === 0) {
        showAlert("Tu carrito está vacío. No se puede generar la orden", 'error');
        return;
    }

    // Generar número único de orden
    const timestamp = Date.now();
    const numeroOrden = `ORD-${timestamp.toString().slice(-6)}`;

    // Mostrar mensaje en pantalla
    mensajeOrden.innerHTML = `
        <strong>¡Pedido confirmado!</strong><br>
        Referencia: ${referencia}<br>
        Número de orden: <span style="color:green">${numeroOrden}</span>
    `;

    try {
        // Iterar sobre los productos del carrito y reducir stock
        for (const item of carrito) {
            await fetch(`/api/productos/${item.id}/reducir-stock`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cantidad: item.cantidad })
            });
        }

        showAlert("Pedido confirmado", 'success');

        // Limpiar campo y resetear interfaz
        refInput.value = "";
        carrito.length = 0;
        renderizarCarrito();
        actualizarTotal();

    } catch (error) {
        console.error("Error al confirmar el pedido:", error);
        showAlert("Hubo un error al procesar el pedido", 'error');
    }

    const now = new Date();
    const fecha = now.toISOString().split("T")[0];
    const hora = now.toTimeString().slice(0, 5);

    await fetch("/api/ventas/pendiente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numeroOrden: numeroOrden,
            referencia: referencia,
            fecha,
            hora
        })
    });
});

document.getElementById("cerrarPedido").addEventListener("click", () => {
    document.getElementById("modalPedido").style.display = "none";
});

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", iniciarApp);


