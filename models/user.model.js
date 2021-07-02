"use strict"
class User {
    constructor(
        id,
        nombre,
        contraseña,
        email,
        telefono,

    ) {
        this.id = id;
        this.fecha_envio = nombre;
        this.fecha_arribo = contraseña;
        this.fecha_estimada_envio = email;
        this.destino_inicial = telefono;

    }
}

module.exports = User;