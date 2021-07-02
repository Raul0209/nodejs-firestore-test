"use strict"

const db = require("../db.js")
const Container = require("../models/container.model");
const firestore = db.firestore();

//Creamos un contenedor
async function createContainer(req, res) {
    if (paramsContainerValidator(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const data = req.body;
        const container = await firestore.collection("container").doc().set(data)
            .then(() => {
                res.status(200).send({ ok: "El contenedor se almaceno de manera correcta" })
            }).catch(err => {
                res.status(500).send({ "error": err })
            })
    }
}

async function getContainers(req, res) {
    try {
        const containers = await firestore.collection("container");
        const data = await containers.get();
        const containersArray = []

        if (data.empty) {
            return res.status(404).send({ empty: "No se han encontrado contenedores" })
        } else {
            data.forEach(doc => {
                const container = new Container(
                    doc.id,
                    doc.data().description,
                    doc.data().products
                )
                containersArray.push(container);
            })
            return res.status(200).send({ ok: containersArray });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": error })
    }
}

async function getContainer(req, res) {
    const id = req.params.id;
    const container = await firestore.collection("container").doc(id);
    const data = await container.get();
    try {
        if (data == undefined || data == null || data == "") {
            console.log("ENTRA?");
            return res.status(404).send({ empty: "No se ha encontrado el contenedor" })
        } else {
            return res.status(200).send({ ok: data.data() })
        }
    } catch (error) {
        res.status(500).send({ "error": error })
    }

}
async function updateContainer(req, res) {
    try {


        if (paramsContainerValidator(req.body)) {
            return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
        } else {
            const id = req.params.id;
            const data = req.body
            const container = await firestore.collection("container").doc(id);
            await container.update(data);
            return res.status(200).send({ ok: "Contenedor actualizado correctamente" })
        }

    } catch (error) {
        res.status(500).send({ "error": error })
    }
}

async function deleteContainer(req, res) {
    const id = req.params.id;

    if (id) {
        try {
            await firestore.collection("container").doc(id).delete();
            return res.status(200).send({ ok: "El contenedor se elimino de manera correcta" })

        } catch (error) {
            res.status(500).send({ "error": error })
        }
    } else {
        return res.status(400).send({ ok: "No se ha proporcionado el id del contenedor a eliminar" })
    }




}


const paramsContainerValidator = container =>
    !container.description;


module.exports = {
    createContainer,
    getContainers,
    getContainer,
    updateContainer,
    deleteContainer
}