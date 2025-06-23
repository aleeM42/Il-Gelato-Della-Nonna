const botonNuevoHelado = document.querySelector('.boton-nuevo-helado');
const consultarHeladoTodo = document.querySelector('.consultar-helado-todo');
document.getElementById("agregar-helado")
    .addEventListener("submit", procesarYGuardarHelado);
const botonCancelarAgregar =  document.querySelector('.btn-cancelar');
const imagenInput = document.getElementById('boton-llenar-imagen');
const previewImagen = document.getElementById('preview-imagen');
let imagenSeleccionada = null;
// Variables de paginación
let paginaActual = 0;
const heladosPorPagina = 4;
const inputBuscar = document.querySelector('.input-buscar');
const spanBuscar = document.querySelector('.Buscar');
// Elementos de la tabla de administrador
const contenedorFilas = document.getElementById('contenedor-filas');
// Popup modal
const modalOverlay = document.getElementById('modal-overlay');
const cerrarPopup = document.querySelector('.cerrar-popup');
// Selecciona los elementos del formulario
const nombreInput = document.getElementById('boton-llenar-nombre');
const precioInput = document.getElementById('boton-llenar-precio');
const stockInput = document.getElementById('boton-llenar-stock');
const descripcionInput = document.getElementById('boton-llenar-descripcion');
const btnGuardar = document.querySelector('.btn-guardar');
const btnCancelar = document.querySelector('.btn-cancelar');


/////// ADMIN AGREGAR HELADOS ///////////
// Cargar productos desde la API
async function cargarProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/productos");

        if (!respuesta.ok) {
            console.error(`Error en la API: ${respuesta.status} - ${respuesta.statusText}`);
            return;
        }

        const contentType = respuesta.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("La respuesta del servidor no es JSON válido.");
            return;
        }

        const productos = await respuesta.json();
        if (!Array.isArray(productos)) {
            console.error("Error: la respuesta de la API no es una lista válida.");
            return;
        }

        renderizarHelados(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarProductos);

function mostrarConsultarHelado() {
    const agregarHelado = document.getElementById("agregar-helado");
    consultarHeladoTodo.classList.remove('oculto');
    agregarHelado.classList.add('oculto');
    manejarPaginacion();
}

function mostrarAgregarHelado() {
    const agregarHelado = document.getElementById("agregar-helado");
    consultarHeladoTodo.classList.add('oculto');
    agregarHelado.classList.remove('oculto');
    manejarPaginacion();
}

if (cerrarPopup) {
    cerrarPopup.addEventListener("click", cerrarModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });
}

function abrirPopup(helado) {
    const nombreEl = document.getElementById("helado-nombre");
    const stockEl = document.getElementById("helado-stock");
    const idEl = document.getElementById("helado-id");
    const precioEl = document.getElementById("helado-precio");
    const descripcionEl = document.getElementById("helado-descripcion");

    if (!nombreEl || !stockEl || !idEl || !precioEl || !descripcionEl || !modalOverlay) {
        console.error("Error: No se encontraron elementos del DOM para mostrar el popup.");
        return;
    }

    // Asignar los valores básicos
    nombreEl.textContent = helado.nombre;
    stockEl.textContent = helado.stock;
    idEl.textContent = helado.id;
    descripcionEl.textContent = helado.descripcion;

    // Convertir precio a número y usar toFixed si es válido
    const precioNumerico = parseFloat(helado.precio);
    if (!isNaN(precioNumerico)) {
        precioEl.textContent = `$${precioNumerico.toFixed(2)}`;
    } else {
        console.warn(`El precio del helado con ID ${helado.id} no es un número válido.`);
        precioEl.textContent = "Precio no disponible";
    }

    modalOverlay.style.display = "flex";
}

function cerrarModal() {
    modalOverlay.style.display = 'none';
}

function renderizarHelados(productos) {
    if (!Array.isArray(productos) || productos.length === 0) {
        console.error("No hay productos disponibles para mostrar.");
        return;
    }
    contenedorFilas.innerHTML = ""; // Limpiar la tabla antes de renderizar
    productos.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio); // Convertir a número
        if (isNaN(precioNumerico)) {
            console.warn(`El precio del producto con ID ${producto.id} no es válido.`);
            return;
        }
        const fila = document.createElement("div");
        fila.className = "fila-datos";
        fila.innerHTML = `
            <div class="ID">${producto.id}</div>
            <div class="nombre">${producto.nombre}</div>
            <div class="precio">$${precioNumerico.toFixed(2)}</div>
            <div class="info">
                <img src="/img/icono-info.png" alt="info" width="20" height="20">
            </div>
        `;
        contenedorFilas.appendChild(fila);
        const linea = document.createElement("div");
        linea.className = "linea-contenedor";
        contenedorFilas.appendChild(linea);

        fila.querySelector(".info img").addEventListener("click", () => abrirPopup(producto));
    });
}

function actualizarPaginaActual() {
    document.getElementById('pagina-actual').textContent = paginaActual;
}

// Paginación
async function manejarPaginacion(texto = "") {
    try {
        const url = texto ? `http://localhost:3000/api/productos?buscar=${encodeURIComponent(texto)}` : "http://localhost:3000/api/productos";
        const respuesta = await fetch(url);
        const productos = await respuesta.json();

        if (!Array.isArray(productos)) {
            console.error("Error: la respuesta de la API no es una lista válida.");
            return;
        }

        renderizarHelados(productos);
        actualizarPaginaActual(productos.length); // Ahora pasamos la cantidad total de productos

    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

document.getElementById('anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        manejarPaginacion();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const botonSiguiente = document.getElementById("siguiente");

    if (botonSiguiente) {
        botonSiguiente.addEventListener("click", async () => {
            try {
                const respuesta = await fetch("http://localhost:3000/api/productos");
                const productos = await respuesta.json();

                if (!Array.isArray(productos)) {
                    console.error("Error: la respuesta de la API no es una lista válida");
                    return;
                }

                const totalPaginas = Math.ceil(productos.length / heladosPorPagina);

                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    manejarPaginacion(productos); // Pasamos los productos como parámetro
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        });
    }
});

async function filtrarHelados(texto) {
    try {
        const url = texto ? `http://localhost:3000/api/productos?buscar=${encodeURIComponent(texto)}` : "http://localhost:3000/api/productos";
        const respuesta = await fetch(url);
        const productos = await respuesta.json();

        if (!Array.isArray(productos)) {
            console.error("Error: la respuesta de la API no es una lista válida.");
            return [];
        }

        return productos; // Devuelve la lista de productos filtrados o completa
    } catch (error) {
        console.error("Error al obtener los productos filtrados:", error);
        return [];
    }
}

inputBuscar?.addEventListener("input", async function() {
    const texto = this.value.trim();

    try {
        const respuesta = await fetch(`http://localhost:3000/api/productos?buscar=${texto}`);
        const productosFiltrados = await respuesta.json();

        paginaActual = 1;
        manejarPaginacion(productosFiltrados);
    } catch (error) {
        console.error("Error al filtrar productos:", error);
    }
});

// Si no tienes un span con clase "Buscar", elimina este bloque
if (spanBuscar) {
    inputBuscar?.addEventListener('focus', function() {
        spanBuscar.style.opacity = '0';
        spanBuscar.style.pointerEvents = 'none';
    });

    inputBuscar?.addEventListener('blur', function() {
        if (!inputBuscar.value) {
            spanBuscar.style.opacity = '1';
            spanBuscar.style.pointerEvents = 'auto';
        }
    });

    inputBuscar?.addEventListener('input', function() {
        if (inputBuscar.value) {
            spanBuscar.style.opacity = '0';
            spanBuscar.style.pointerEvents = 'none';
        } else {
            spanBuscar.style.opacity = '1';
            spanBuscar.style.pointerEvents = 'auto';
        }
    });
}

botonNuevoHelado?.addEventListener('click', function() {
    mostrarAgregarHelado();
});

botonCancelarAgregar?.addEventListener('click', function() {
    mostrarConsultarHelado();
});

// Función para validar los campos

async function validarCampos() {
    let esValido = true;
    const errores = [];

    if (!nombreInput.value.trim()) {
        errores.push("El nombre es obligatorio");
        esValido = false;
    }

    if (!precioInput.value.trim() || isNaN(precioInput.value)) {
        errores.push("El precio debe ser un número válido");
        esValido = false;
    }

    if (!stockInput.value.trim() || isNaN(stockInput.value) || parseInt(stockInput.value) < 0) {
        errores.push("El stock debe ser un número positivo");
        esValido = false;
    }

    if (!descripcionInput.value.trim()) {
        errores.push("La descripción es obligatoria");
        esValido = false;
    }

    if (!imagenInput.value.trim()) {
        errores.push("La imagen es obligatoria");
        esValido = false;
    }

    if (errores.length > 0) {
        alert(errores.join("\n"));
        return false;
    }

    return esValido;
}

async function procesarYGuardarHelado(event) {
    event.preventDefault(); // Detener el formulario

    if (!validarCampos()) return;

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const precio = parseFloat(precioInput.value);
    const stock = parseInt(stockInput.value);
    const inputImagen = document.getElementById("boton-llenar-imagen");
    const file = inputImagen.files[0];

    if (!file) {
        alert("Por favor selecciona una imagen.");
        return;
    }

    try {
        const imagenComprimida = await comprimirImagen(file);
        console.log("Longitud de imagen base64:", imagenComprimida.length);
        const nuevoHelado = {
            nombre,
            descripcion,
            precio,
            stock,
            imagen: imagenComprimida // Base64 ya comprimido
        };

        console.log("Enviando a backend:", nuevoHelado);

        const respuesta = await fetch("http://localhost:3000/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoHelado)
        });

        if (!respuesta.ok) {
            const textoPlano = await respuesta.text();
            console.error("Respuesta de error:", textoPlano);
            alert("Error al guardar el producto. Revisa la consola.");
        } else {
            alert("Producto guardado exitosamente.");
            limpiarFormulario();
            cargarProductos();
        }
    } catch (error) {
        console.error("Error en el proceso:", error);
        alert("Ocurrió un error inesperado.");
    }
}

async function comprimirImagen(file, maxWidth = 600, quality = 0.5) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
                resolve(compressedBase64);
            };

            img.onerror = err => reject(err);
        };

        reader.onerror = err => reject(err);
    });
}

function limpiarFormulario() {
    nombreInput.value = "";
    precioInput.value = "";
    stockInput.value = "";
    imagenInput.value = "";
    descripcionInput.value = "";
    previewImagen.innerHTML = "";
    imagenSeleccionada = null;
    mostrarConsultarHelado();
}

// Asignar evento al botón de guardar
btnGuardar.addEventListener('click', procesarYGuardarHelado);

btnCancelar.addEventListener('click', function() {
    limpiarFormulario();
});

imagenInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImagen.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: contain;">`;
            imagenSeleccionada = e.target.result; // Guarda la imagen en base64
        };
        reader.readAsDataURL(file);
    }
});