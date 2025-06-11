document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const cedula = document.getElementById('cedula').value;
    const phone = document.getElementById('telefono').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        const res = await fetch('/api/usuarios/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, cedula, password, phone })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Registro exitoso");
            window.location.href = '/'; // o redirige a login
        } else {
            alert("Error: " + data.mensaje);
        }
    } catch (err) {
        alert("Error de conexión");
        console.error(err);
    }
});