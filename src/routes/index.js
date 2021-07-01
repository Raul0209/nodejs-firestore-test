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

//Envios
router.post("/shipping", async(req, res) => {
    if (areMissingParamsShipping(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const shipping = await db.collection('shipping').doc();
        shipping.set({

            'FECHA_ENVIO ': req.body.fechaEnvio,
            'FECHA_ARRIBO ': req.body.fechaArribo,
            'FECHA_ESTIMADA_ENTREGA ': req.body.fechaEstimadaEntrega,
            'DESTINO_INICIAL ': req.body.destinoInicial,
            'DESTINO_FINAL	': req.body.destinoFinal
        });
        return res.status(200).send({ "message": "Envio almacenado correctamente" })
    }
})

//Destinos
router.post("/destinations", async(req, res) => {
    if (areMissingParamsDestinations(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const destinations = await db.collection('destinations').doc();
        destinations.set({

            'NOMBRE': req.body.nombre,
            'DIRECCION': req.body.direccion,
            'PAIS': req.body.pais,
            'CIUDAD': req.body.ciudad,
            'TIPO': req.body.tipo
        });
        return res.status(200).send({ "message": "Destino almacenado correctamente" })
    }
})

//Contenedores
router.post("/container", async(req, res) => {
    if (areMissingParamsContainer(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    } else {
        const container = await db.collection('container').doc();
        container.set({

            'DESCRIPCION': req.body.descripcion,
            'PRODUCTOS': [{}]
        });
        return res.status(200).send({ "message": "Contenedor almacenado correctamente" })
    }
})

//Proveedores
//Cuando recibimos una ruta post ejecutamos lo que esta adentro
router.post("/provider", async(req, res) => {
    //Verificamos que el cuerpo de la consulta tenga todos los campos necesarios
    //Si hacen falta campos
    if (areMissingParamsProvider(req.body)) {
        return res.status(400).send({ "message": "No has ingresado los campos requeridos" });
    }
    //Si no hacen falta campos
    else {
        //Nos conectamos a la tabla provider
        const provider = await db.collection('providers').doc();

        //Asignamos datos a almacenar en las tablas y luego guardamos
        provider.set({
            //Asignamos datos
            //Izquierda es como se va a guardar
            //Derecha es como se envia en postman o cuerpo de consulando
            'NOMBRE': req.body.nombre,
            'DIRECCION': req.body.direccion,
            'PRODUCTOS': [{}]
        });
        //Devolvemos mensaje para indicar que la consulta se ejecuto exitosamente
        return res.status(200).send({ "message": "Proveedor almacenado correctamente" });


    }
})


//Usuarios
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

const areMissingParamsContainer = container => {
    !container.descripcion;
}
const areMissingParamsDestinations = destinations => {
    !destinations.nombre ||
        !destinations.direccion ||
        !destinations.pais ||
        !destinations.ciudad ||
        !destinations.tipo;
}

const areMissingParamsShipping = shipping => {
    !shipping.fechaEnvio ||
        !shipping.fechaArribo ||
        !shipping.fechaEstimadaEntrega ||
        !shipping.destinoInicial ||
        !shipping.destinoFinal;
}

module.exports = router;