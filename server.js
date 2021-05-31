"use strict"

require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const axios = require('axios');
const PORT = 3001;
const mongoose = require('mongoose')

const books = require('./books.js');




server.get('/', homeRouteHandler);
function homeRouteHandler(req, res) {
    res.send('home route')
}


server.get('/books', books);


server.get('*', errorsHandler);
function errorsHandler(req, res) {
    res.status(404).send('Something went wrong');
}


server.listen(PORT, () => {
    console.log(`listen on Port ${PORT}`);
});
