const db = require("../db.js")
const Shipping = require("../models/shipping.model");
const firestore = db.firestore();

//Creamos un contenedor
async function createShipping(req, res) {
    if (paramsShippingValidator(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const data = req.body;
        const shipping = await firestore.collection("shipping").doc().set(data)
            .then(() => {
                res.status(200).send({ ok: "El destino se almaceno de manera correcta" })
            }).catch(err => {
                res.status(500).send({ "error": err })
            })
    }
}

async function getShippings(req, res) {
    try {
        const shippings = await firestore.collection("shipping");
        const data = await shippings.get();
        const shippingsArray = []

        if (data.empty) {
            return res.status(404).send({ empty: "No se han encontrado destino" })
        } else {
            data.forEach(doc => {
                const shipping = new Shipping(
                    doc.id,
                    doc.data().fecha_envio,
                    doc.data().fecha_arribo,
                    doc.data().fecha_estimada_envio,
                    doc.data().destino_inicial,
                    doc.data().destino_final
                )
                shippingsArray.push(shipping);
            })
            return res.status(200).send({ ok: shippingsArray });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": error })
    }
}

async function getShipping(req, res) {
    const id = req.params.id;
    const shipping = await firestore.collection("shipping").doc(id);
    const data = await shipping.get();
    try {
        if (data == undefined || data == null || data == "") {
            console.log("ENTRA?");
            return res.status(404).send({ empty: "No se ha encontrado el destino" })
        } else {
            return res.status(200).send({ ok: data.data() })
        }
    } catch (error) {
        res.status(500).send({ "error": error })
    }

}
async function updateShipping(req, res) {
    try {


        if (paramsShippingValidator(req.body)) {
            return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
        } else {
            const id = req.params.id;
            const data = req.body
            const shipping = await firestore.collection("shipping").doc(id);
            await shipping.update(data);
            return res.status(200).send({ ok: "Destino actualizado correctamente" })
        }

    } catch (error) {
        res.status(500).send({ "error": error })
    }
}

async function deleteShipping(req, res) {
    const id = req.params.id;

    if (id) {
        try {
            await firestore.collection("shipping").doc(id).delete();
            return res.status(200).send({ ok: "El destino se elimino de manera correcta" })

        } catch (error) {
            res.status(500).send({ "error": error })
        }
    } else {
        return res.status(400).send({ ok: "No se ha proporcionado el id del contenedor a eliminar" })
    }




}


const paramsShippingValidator = shipping =>
    !shipping.fecha_envio ||
    !shipping.fecha_arribo ||
    !shipping.fecha_estimada_envio ||
    !shipping.destino_inicial ||
    !shipping.destino_final;




module.exports = {
    createShipping,
    getShippings,
    getShipping,
    updateShipping,
    deleteShipping
}