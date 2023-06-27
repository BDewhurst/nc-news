const { selectAllTopics } = require("../app.models/app.model")

exports.getAllTopics = (req, res) => {
    selectAllTopics().then((topics) => {
        res.status(200).send(topics)
    }).catch((err) => {
        next(err)
    }) 
}

