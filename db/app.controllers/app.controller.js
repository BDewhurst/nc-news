const jsonInfo = require('/home/brad1996/northcoders/backend/portfolio/be-nc-news/endpoints.json')
const { selectAllTopics, selectArticleId, selectAllArticles, selectArticleIdComments, sendArticleIdComments } = require("../app.models/app.model")

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
    selectAllArticles().then((articles) => {
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
