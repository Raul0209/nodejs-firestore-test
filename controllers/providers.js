const db = require("../db.js")
const Provider = require("../models/container.model");
const firestore = db.firestore();

//Creamos un contenedor
async function createProvider(req, res) {
    if (paramsProviderValidator(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const data = req.body;
        const provider = await firestore.collection("provider").doc().set(data)
            .then(() => {
                res.status(200).send({ ok: "El proveedor se almaceno de manera correcta" })
            }).catch(err => {
                res.status(500).send({ "error": err })
            })
    }
}

async function getProviders(req, res) {
    try {
        const providers = await firestore.collection("provider");
        const data = await providers.get();
        const providersArray = []

        if (data.empty) {
            return res.status(404).send({ empty: "No se han encontrado proveedores" })
        } else {
            data.forEach(doc => {
                const provider = new Provider(
                    doc.nombre,
                    doc.data().direccion,
                    doc.data().products
                )
                providersArray.push(provider);
            })
            return res.status(200).send({ ok: providersArray });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": error })
    }
}

async function getProvider(req, res) {
    const id = req.params.id;
    const provider = await firestore.collection("provider").doc(id);
    const data = await provider.get();
    try {
        if (data == undefined || data == null || data == "") {
            console.log("ENTRA?");
            return res.status(404).send({ empty: "No se ha encontrado el proveedor" })
        } else {
            return res.status(200).send({ ok: data.data() })
        }
    } catch (error) {
        res.status(500).send({ "error": error })
    }

}
async function updateProvider(req, res) {
    try {


        if (paramsProviderValidator(req.body)) {
            return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
        } else {
            const id = req.params.id;
            const data = req.body
            const provider = await firestore.collection("provider").doc(id);
            await provider.update(data);
            return res.status(200).send({ ok: "Proveedor actualizado correctamente" })
        }

    } catch (error) {
        res.status(500).send({ "error": error })
    }
}

async function deleteProvider(req, res) {
    const id = req.params.id;

    if (id) {
        try {
            await firestore.collection("provider").doc(id).delete();
            return res.status(200).send({ ok: "El proveedor se elimino de manera correcta" })

        } catch (error) {
            res.status(500).send({ "error": error })
        }
    } else {
        return res.status(400).send({ ok: "No se ha proporcionado el id del contenedor a eliminar" })
    }




}


const paramsProviderValidator = provider =>
    !provider.nombre ||
    !provider.direccion;



module.exports = {
    createProvider,
    getProviders,
    getProvider,
    updateProvider,
    deleteProvider
}