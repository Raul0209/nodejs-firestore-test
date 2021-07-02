"use strict"

const express = require("express");
const cors = require("cors");
const config = require("./config");
const app = express();

const _containerRoutes = require("./routes/container.routes");
const _providerRoutes = require("./routes/provider.routes");
const _shippingRoutes = require("./routes/shipping.routes");
const _userRoutes = require("./routes/user.routes");


const morgan = require("morgan");


app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

app.use("/api", _containerRoutes, _providerRoutes, _shippingRoutes, _userRoutes, );

app.listen(config.port, () => console.log("App is listening in port: ", config.port))