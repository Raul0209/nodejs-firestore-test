'use strict'

const { Router } = require("express");
const router = Router();
const admin = require("firebase-admin")

const serviceAccount = require("../../prueba-insight-firebase-adminsdk-mhv5j-267a9e7290.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://prueba-insight-default-rtdb.firebaseio.com/"
})

const db = admin.firestore();

router.get("/contacts", async(req, res) => {
    const snapshot = await db.collection('users').get();

    var users = []
    var id = []

    snapshot.forEach((doc) => {
        id.push(doc.id)
        users.push(doc.data())
    });
    for (let x = 0; x < users.length; x++) {
        users[x].id = id[x]
    }

    return res.status(200).send({ "Users": users })
})

router.post('/user', async(req, res) => {


    if (areMissingParams(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const userToSearch = await db.collection('users');
        const validateUser = (await userToSearch.where('EMAIL', '==', req.body.email).get()).docs

        console.log("USUARIO VALIDADO ", validateUser);
        if (validateUser.length == 0) {
            try {
                const user = await db.collection('users').doc();
                user.set({
                    'NOMBRE': req.body.nombre,
                    'CONTRASEÑA': req.body.contraseña,
                    'EMAIL': req.body.email,
                    'TELEFONO': req.body.telefono

                });
                return res.status(200).send({ message: "Usuario almacenado correctamente" })
            } catch (error) {
                console.log(error);
            }

        } else {
            return res.status(200).send({ message: "EL correo electronico ya se encuentra registrado en el sistema" })
        }
    }
})

const areMissingParams = params =>
    !params.nombre ||
    !params.contraseña ||
    !params.email ||
    !params.telefono;


const areMissingParamsProvider = provider =>
    !provider.nombre ||
    !provider.direccion;


module.exports = router;