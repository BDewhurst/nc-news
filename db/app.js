const {getAllTopics, getApi, getArticleId, getAllArticles} = require('./app.controllers/app.controller')
const {handleServerErrors, routeNotFound, handleCustomErrors, handlePsqlErrors} = require('./errors')
const express = require("express");
const app = express();
app.use(express.json());
module.exports = app;

app.get('/api', getApi)
app.get('/api/topics', getAllTopics)
app.get('/api/articles/:article_id', getArticleId)
app.get('/api/articles', getAllArticles)


app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors);

app.all("*", routeNotFound)
