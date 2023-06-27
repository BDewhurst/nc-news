const jsonInfo = require('/home/brad1996/northcoders/backend/portfolio/be-nc-news/endpoints.json')
const { selectAllTopics } = require("../app.models/app.model")

exports.getApi = (req, res) => {
res.status(200).send(jsonInfo)
}


exports.getAllTopics = (req, res) => {
    selectAllTopics().then((topics) => {
        res.status(200).send(topics)
    }).catch((err) => {
        next(err)
    }) 
}

