const db = require("../connection");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleId = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE articles.article_id = $1`, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `No article found for article_id: ${article_id}`
      })
    }
    return rows;
  })
}