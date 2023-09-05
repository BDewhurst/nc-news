const jsonInfo = require('../../endpoints.json')
const { selectAllTopics, selectArticleId, selectAllArticles, selectArticleIdComments, sendArticleIdComments, updateArticle, removeComment, selectAllUsers, selectUsername, updateVote } = require("../app.models/app.model")

exports.getApi = (req, res) => {
    res.status(200).send(jsonInfo)
}


exports.getAllTopics = (req, res, next) => {
    selectAllTopics().then((topics) => {
        res.status(200).send(topics)
    }).catch(next)
}

exports.getArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectArticleId(article_id).then((article) => {
        res.status(200).send({ article: article })
    }).catch(next)
}

exports.getAllArticles = (req, res, next) => {
    const query = req.query
    if (!("order" in query)) {query.order = "desc"}
    if(!("sort_by" in query)) {query.sort_by = "created_at"}
    if(!("topic" in query)) {query.topic = ""}
  selectAllArticles(query.order, query.sort_by, query.topic).then((articles) => {
        res.status(200).send({ articles: articles })
    }).catch(next)
}

exports.getAllArticlesComments = (req, res, next) => {
    const { article_id } = req.params
    selectArticleIdComments(article_id).then((comments) => {
        res.status(200).send({ comments: comments })
    }).catch(next)
}

exports.getPostComment = (req, res, next) => {
    const { article_id } = req.params
    const newComment = req.body
    sendArticleIdComments(newComment, article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch(next) 
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const updateForArticle = req.body
    updateArticle(article_id, updateForArticle).then((votes) => {
        res.status(201).send({ votes: votes })
    }).catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id).then((message) => {
        res.status(204).send(message)
    }).catch(next)
}

exports.getAllUsers = (req, res, next) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users: users })
    }).catch(next)
}

exports.getUsername = (req, res, next) => {
    const {username} = req.params
    selectUsername(username).then((user) => {
        res.status(200).send(({user: user}))
    }).catch(next)
}

exports.patchComments = (req, res, next) => {
  
    const {comment_id} = req.params
    const update = req.body

    updateVote(comment_id, update).then((comment) => {
        res.status(201).send({comment: comment})
    }).catch(next)
}