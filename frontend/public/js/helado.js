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
//modificar
const modalModificarOverlay = document.getElementById('modal-modificar-overlay');
const formModificar = document.getElementById('form-modificar-helado');
const inputModificarId = document.getElementById('modificar-id');
const inputModificarNombre = document.getElementById('modificar-nombre');
const inputModificarStock = document.getElementById('modificar-stock');
const inputModificarPrecio = document.getElementById('modificar-precio');
const inputModificarDescripcion = document.getElementById('modificar-descripcion');
const inputModificarImagen = document.getElementById('modificar-imagen');
const previewImagenModificar = document.getElementById('preview-imagen-modificar');
const btnCancelarModificar = modalModificarOverlay.querySelector('.btn-cancelar-modificacion');
const cerrarPopupModificar = modalModificarOverlay.querySelector('.cerrar-popup-modificar');
const btnEliminarModificar = modalModificarOverlay.querySelector('.btn-eliminar-modificacion');

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
            <div class="modificar">
                <img src="/img/icono-modificar.png" alt="modificar" width="20" height="20">
            </div>
            <div class="info">
                <img src="/img/icono-info.png" alt="info" width="20" height="20">
            </div>
        `;
        contenedorFilas.appendChild(fila);
        const linea = document.createElement("div");
        linea.className = "linea-contenedor";
        contenedorFilas.appendChild(linea);
        fila.querySelector(".modificar img").addEventListener("click", () => abrirModificar(producto));
        fila.querySelector(".info img").addEventListener("click", () => abrirPopup(producto));
    });
}

function abrirModificar(helado) {
    inputModificarId.value = helado.id;
    inputModificarNombre.value = helado.nombre;
    inputModificarStock.value = helado.stock;
    inputModificarPrecio.value = helado.precio;
    inputModificarDescripcion.value = helado.descripcion;
    inputModificarImagen.value = '';
    
    previewImagenModificar.innerHTML = '';
    if (helado.imagen) {
        previewImagenModificar.innerHTML = `
            <div style="background: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
                        background-size: 20px 20px;">
                <img src="${helado.imagen}" style="max-width: 100%; max-height: 200px; background: transparent;">
            </div>
        `;
    }
    
    modalModificarOverlay.style.display = 'flex';
}

function cerrarModificar() {
    // Limpiar el input de imagen al cerrar
    inputModificarImagen.value = '';
    previewImagenModificar.innerHTML = '';
    
    // Ocultar el modal
    modalModificarOverlay.style.display = 'none';
}

btnCancelarModificar.addEventListener('click', cerrarModificar);
cerrarPopupModificar.addEventListener('click', cerrarModificar);
modalModificarOverlay.addEventListener('click', (e) => {
    if (e.target === modalModificarOverlay) {
        cerrarModificar();
    }
});
// Manejador de cambio para el input de imagen
inputModificarImagen.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImagenModificar.innerHTML = `
                <div style="background: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
                            background-size: 20px 20px;">
                    <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; background: transparent;">
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        // Si no se selecciona archivo, mantener la imagen actual
        const currentImg = document.querySelector('#preview-imagen-modificar img');
        if (!currentImg) {
            previewImagenModificar.innerHTML = '';
        }
    }
});

// Asegurarse de limpiar al cancelar
btnCancelarModificar.addEventListener('click', cerrarModificar);
cerrarPopupModificar.addEventListener('click', cerrarModificar);
modalModificarOverlay.addEventListener('click', (e) => {
    if (e.target === modalModificarOverlay) {
        cerrarModificar();
    }
});
async function validarCamposModificar() {
    let esValido = true;
    const errores = [];

    if (!inputModificarNombre.value.trim()) {
        errores.push("El nombre es obligatorio");
        esValido = false;
    }

    if (!inputModificarPrecio.value.trim() || isNaN(inputModificarPrecio.value)) {
        errores.push("El precio debe ser un número válido");
        esValido = false;
    }

    if (!inputModificarStock.value.trim() || isNaN(inputModificarStock.value) || parseInt(inputModificarStock.value) < 0) {
        errores.push("El stock debe ser un número positivo");
        esValido = false;
    }

    if (!inputModificarDescripcion.value.trim()) {
        errores.push("La descripción es obligatoria");
        esValido = false;
    }

    if (errores.length > 0) {
        alert(errores.join("\n"));
        return false;
    }

    return esValido;
}

formModificar.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {        
        const id = inputModificarId.value;
        const nombre = inputModificarNombre.value.trim();
        const stock = parseInt(inputModificarStock.value);
        const precio = parseFloat(inputModificarPrecio.value);
        const descripcion = inputModificarDescripcion.value.trim();
        const file = inputModificarImagen.files[0];

        // Validación básica
        if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
            throw new Error("Por favor complete todos los campos correctamente");
        }

        // Manejo de imagen
        let imagenBase64;
        if (file) {
            imagenBase64 = await comprimirImagen(file);
        } else {
            const imgElement = previewImagenModificar.querySelector('img');
            imagenBase64 = imgElement?.src || null;
        }

        if (!imagenBase64) {
            throw new Error("Se requiere una imagen del producto");
        }

        // Preparar datos para enviar
        const productoData = {
            nombre,
            descripcion,
            precio,
            stock,
            imagen: imagenBase64
        };

        const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(productoData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error del servidor:", result);
            throw new Error(result.error || "Error al actualizar el producto");
        }

        alert("Producto actualizado correctamente");
        cerrarModificar();
        cargarProductos();

    } catch (error) {
        console.error("Error en la actualización:", error);
        alert(`Error: ${error.message}`);
    }
});

function actualizarPaginaActual() {
    document.getElementById('pagina-actual').textContent = paginaActual;
}

btnEliminarModificar.addEventListener('click', async function() {
    const id = inputModificarId.value;
    
    if (!id) {
        alert('No se pudo obtener el ID del producto');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar el producto');
        }

        alert('Producto eliminado correctamente');
        cerrarModificar();
        cargarProductos(); // Recargar la lista de productos
    } catch (error) {
        alert(`Error al eliminar el producto: ${error.message}`);
    }
});

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

// Función para guardar el nuevo helado
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
        const nuevoHelado = {
            nombre,
            descripcion,
            precio,
            stock,
            imagen: imagenComprimida // Base64 ya comprimido
        };

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

async function comprimirImagen(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(maxWidth / img.width, 1);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Usar el formato original o JPEG por defecto
                const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                resolve(canvas.toDataURL(format, quality));
            };
            img.onerror = () => reject(new Error("Error al cargar la imagen"));
        };
        reader.onerror = () => reject(new Error("Error al leer el archivo"));
        reader.readAsDataURL(file);
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