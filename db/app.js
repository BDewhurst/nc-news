const {getAllTopics, getApi} = require('./app.controllers/app.controller')
const {handleServerErrors, routeNotFound} = require('./errors')
const express = require("express");
const app = express();
app.use(express.json());
module.exports = app;

app.get('/api', getApi)
app.get('/api/topics', getAllTopics)
app.all("*", routeNotFound)

app.use(handleServerErrors);