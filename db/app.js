const {getAllTopics} = require('./app.controllers/app.controller')
const {routeNotFound} = require('./app.controllers/app.controller')
const express = require("express");
const app = express();
app.use(express.json());
module.exports = app;

app.get('/api/topics', getAllTopics)
app.all("*", routeNotFound)