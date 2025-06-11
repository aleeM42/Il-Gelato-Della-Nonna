class Usuario {
    constructor(nombre, email, cedula, password, phone) {
        this.nombre = nombre;
        this.email = email;
        this.cedula = cedula;
        this.password = password;
        this.phone = phone;
    }
}

class Cliente extends Usuario{
    constructor(nombre, email, cedula, password, phone) {
        super(nombre, email, cedula, password, phone);
        this.esAdmin = false;
    }
}


class Admin extends Usuario {
    constructor(nombre, email, cedula, password, phone) {
        super(email,password);
        this.esAdmin = true;
    }
}

module.exports = {
    Cliente,
    Usuario,
    Admin
};