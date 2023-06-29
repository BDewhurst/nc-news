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

exports.selectAllArticles = () => {
  return db.query(`SELECT articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.article_img_url, 
  articles.votes,  
  (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
FROM articles
ORDER BY articles.created_at DESC;`)
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleIdComments = (article_id) => {
  return db.query(`SELECT * FROM comments WHERE comments.article_id = $1
  ORDER BY comments.created_at;`, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return checkArticleIdExists(article_id)
    }
    return rows;
  })
}

const checkArticleIdExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: `No article found for article_id: ${article_id}`
      })
    }
    return []
  })
}

exports.sendArticleIdComments = (newComment, article_id) => {
  const { author, body, username, name } = newComment
  const insertQueryUser = `INSERT INTO users (username, name)
  VALUES 
  ($1, $2)
  RETURNING*;`
  const insertQueryComments = `
  INSERT INTO comments ( author, body, article_id)
  VALUES ($1, $2, $3)
  RETURNING *;`;
  return db.query(insertQueryUser, [username, name]).then(() => {return db.query(insertQueryComments, [author, body, article_id])
    .then(({ rows }) => {
      return rows})
  
    })
}

