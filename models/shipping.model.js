"use strict"
class Shipping {
    constructor(
        id,
        fecha_envio,
        fecha_arribo,
        fecha_estimada_envio,
        destino_inicial,
        destino_final
    ) {
        this.id = id;
        this.fecha_envio = fecha_envio;
        this.fecha_arribo = fecha_arribo;
        this.fecha_estimada_envio = fecha_estimada_envio;
        this.destino_inicial = destino_inicial;
        this.destino_final = destino_final;

    }
}

module.exports = Shipping;