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

exports.selectAllArticles = (order, sort_by, topic) => {
  return db.query(`SELECT articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.article_img_url, 
  articles.votes,
  (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
FROM articles 
${topic != "" ? "WHERE articles.topic='" + topic  + "'": ''}
ORDER BY articles.${sort_by} ${order};`)
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
  const { body, username } = newComment
  const insertQueryComments = `
  INSERT INTO comments ( author, body, article_id)
  VALUES ($1, $2, $3)
  RETURNING *;`;
  return db.query(insertQueryComments, [username, body, article_id])
    .then(({ rows }) => {
      return rows
    })
  }



exports.updateArticle = (article_id, updateForArticle) => {
  if (!Object.keys(updateForArticle).includes('inc_vote')) {
    return Promise.reject({ status: 400, message: 'bad request' })
  }
  const {inc_vote} = updateForArticle
  return db.query(`UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *;`, [article_id, inc_vote]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `No article found for article_id: ${article_id}`
      })
    }
    return rows
  })
}

exports.removeComment = (comment_id) => {
  const deleteQuery = `DELETE FROM comments
      WHERE comment_id = $1;`
  return db.query(deleteQuery, [comment_id]).then(({rows}) => {
    if (rows.length === 0) {
      return {message: `${comment_id} has been deleted`}
    }
    return rows
  })
}

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};