'use strict'
const express = require("express");
const app = express();
const morgan = require("morgan");

//Setting
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(require('./routes/index.js'))

//Static Files


module.exports = app;