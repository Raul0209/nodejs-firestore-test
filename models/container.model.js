"use strict"
class Container {
    constructor(
        id,
        description,
        products
    ) {
        this.id = id;
        this.description = description;
        this.products = products;
    }
}

module.exports = Container;