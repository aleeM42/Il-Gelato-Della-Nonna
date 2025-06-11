document.querySelector('.login-button').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        const res = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("email", data.perfil.email);
            alert("Inicio de sesión exitoso.");


            if (data.perfil.esAdmin) {
                window.location.href = '/consultar-ventas';
            } else {
                window.location.href = '/catalogo';
            }
        } else {
            alert("Error: " + data.mensaje);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error de conexión con el servidor.");
    }
});