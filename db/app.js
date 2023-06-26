const {getAllTopics, routeNotFound} = require('./app.controllers/app.controller')
const {handleServerErrors} = require('./errors')
const express = require("express");
const app = express();
app.use(express.json());
module.exports = app;

app.get('/api/topics', getAllTopics)
app.all("*", routeNotFound)

app.use(handleServerErrors);