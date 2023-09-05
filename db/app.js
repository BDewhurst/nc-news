const {getAllTopics, getApi, getArticleId, getAllArticles, getAllArticlesComments, getPostComment, patchArticle, deleteComment, getAllUsers, getUsername, patchComments, postArticle} = require('./app.controllers/app.controller')
const {handleServerErrors, routeNotFound, handleCustomErrors, handlePsqlErrors} = require('./errors')
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
module.exports = app;

app.get('/api', getApi)
app.get('/api/topics', getAllTopics)
app.get('/api/articles/:article_id', getArticleId)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getAllArticlesComments)
app.get('/api/users', getAllUsers)
app.post('/api/articles/:article_id/comments', getPostComment)
app.post('/api/articles', postArticle)
app.patch('/api/articles/:article_id', patchArticle )
app.patch('/api/comments/:comment_id', patchComments )
app.get('/api/users/:username', getUsername)
app.delete('/api/articles/comments/:comment_id', deleteComment)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors);

app.all("*", routeNotFound)
