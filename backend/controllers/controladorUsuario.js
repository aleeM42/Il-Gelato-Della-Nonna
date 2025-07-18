const db = require('../config/db');
const { Usuario, Admin } = require('../models/Usuario');

async function crearPerfil(nombre, email, cedula, password, phone, esAdmin = false) {
    try {
        if (!nombre || !email || !cedula || !password || !phone) {
            return { exito: false, mensaje: "Todos los campos son obligatorios" };
        }

        // Verificar si ya existe un usuario con ese email o cédula
        const [existente] = await db.query('SELECT * FROM usuarios WHERE email = ? OR cedula = ?', [email, cedula]);
        if (existente.length > 0) {
            return { exito: false, mensaje: "Ya existe un usuario con ese correo o cédula" };
        }

        const perfil = esAdmin
            ? new Admin(nombre, email, cedula, password, phone)
            : new Usuario(nombre, email, cedula, password, phone);
        const rol = esAdmin ? 1 : 0;

        // Ahora sí, después de crear el perfil
        console.log("Datos para insertar:", [perfil.nombre, perfil.email, perfil.cedula, perfil.password, perfil.phone, rol]);

        await db.query(
            'INSERT INTO usuarios (nombre, email, cedula, password, phone, es_admin) VALUES (?, ?, ?, ?, ?, ?)',
            [perfil.nombre, perfil.email, perfil.cedula, perfil.password, perfil.phone, rol]
        );

        return { exito: true, mensaje: "Perfil creado exitosamente", perfil };
    } catch (err) {
        console.error("Error en crearPerfil:", err);
        return { exito: false, mensaje: "Error al registrar el perfil" };
    }
}

async function iniciarSesion(email, password) {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);

        if (rows.length === 0) {
            return { exito: false, mensaje: "Credenciales incorrectas" };
        }

        const user = rows[0];
        return {
            exito: true,
            mensaje: "Sesión iniciada",
            perfil: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                esAdmin: !!user.es_admin
            }
        };
    } catch (err) {
        console.error("Error en iniciarSesion:", err);
        return { exito: false, mensaje: "Error al iniciar sesión" };
    }
}

async function obtenerPerfil(email) {
    const [rows] = await db.query('SELECT nombre, email, cedula, password, phone FROM usuarios WHERE email = ?', [email]);
    return rows[0];
}

async function actualizarPerfil(emailOriginal, nuevoPerfil) {
    try {
        const { nombre, cedula, password, phone } = nuevoPerfil;
        const [resultado] = await db.query(
            `UPDATE usuarios SET nombre = ?, cedula = ?, password = ?, phone = ? WHERE email = ?`,
            [nombre, cedula, password, phone, emailOriginal]
        );

        return { exito: true, mensaje: "Perfil actualizado correctamente" };
    } catch (err) {
        console.error("Error al actualizar perfil:", err);
        return { exito: false, mensaje: "Error al actualizar el perfil" };
    }
}

async function eliminarPerfil(email) {
    try {
        const [resultado] = await db.query(`DELETE FROM usuarios WHERE email = ?`, [email]);

        return { exito: true, mensaje: "Perfil eliminado correctamente" };
    } catch (err) {
        console.error("Error al eliminar perfil:", err);
        return { exito: false, mensaje: "Error al eliminar el perfil" };
    }
}

module.exports = {
    crearPerfil,
    iniciarSesion,
    obtenerPerfil,
    eliminarPerfil,
    actualizarPerfil
};