"use strict"
class Provider {
    constructor(
        id,
        nombre,
        direccion,
        products
    ) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.products = products;
    }
}

module.exports = Provider;