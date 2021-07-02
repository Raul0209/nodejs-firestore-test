const db = require("../db.js")
const User = require("../models/user.model");
const firestore = db.firestore();

//Creamos un contenedor
async function createUser(req, res) {
    if (paramsUserValidator(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const data = req.body;
        const user = await firestore.collection("user").doc().set(data)
            .then(() => {
                res.status(200).send({ ok: "El usuario se almaceno de manera correcta" })
            }).catch(err => {
                res.status(500).send({ "error": err })
            })
    }
}

async function getUsers(req, res) {
    try {
        const users = await firestore.collection("user");
        const data = await users.get();
        const usersArray = []

        if (data.empty) {
            return res.status(404).send({ empty: "No se han encontrado usuario" })
        } else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().nombre,
                    doc.data().contraseña,
                    doc.data().email,
                    doc.data().telefono,
                )
                usersArray.push(user);
            })
            return res.status(200).send({ ok: usersArray });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": error })
    }
}

async function getUser(req, res) {
    const id = req.params.id;
    const user = await firestore.collection("user").doc(id);
    const data = await user.get();
    try {
        if (data == undefined || data == null || data == "") {
            console.log("ENTRA?");
            return res.status(404).send({ empty: "No se ha encontrado el usuario" })
        } else {
            return res.status(200).send({ ok: data.data() })
        }
    } catch (error) {
        res.status(500).send({ "error": error })
    }

}

const paramsUserValidator = user =>
    !user.nombre ||
    !user.foto ||
    !user.email ||
    !user.telefono;




module.exports = {
    createUser,
    getUsers,
    getUser,

}