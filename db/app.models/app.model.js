const db = require("../connection");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleId = (article_id) => {

  return db.query(`SELECT articles.*, COALESCE(comments.comment_count, 0) AS comment_count
  FROM articles
  LEFT JOIN (
    SELECT article_id, COUNT(*) AS comment_count
    FROM comments
    WHERE article_id = $1
    GROUP BY article_id
  ) comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1`, [article_id]).then(({ rows }) => {
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
  return db.query(`SELECT * FROM users;`,).then(({ rows }) => {
    return rows;
  });
};

exports.selectUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1;`, [username]).then(({rows})=> {
    return rows;
  })
}

exports.updateVote = (comment_id, update) => {
  if (!Object.keys(update).includes('inc_vote')) {
    return Promise.reject({ status: 400, message: 'bad request' })
  }
  const {inc_vote} = update
  return db.query(`UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *;`, [comment_id, inc_vote]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `No article found for comment_id: ${comment_id}`
      })
    }
    return rows
  })
}

exports.postNewArticle = (newArticle) => {
const {title, topic, author, body, article_img_url} = newArticle
return db.query(`INSERT into articles (title, topic, author, body, article_img_url) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *`, [title, topic, author, body, article_img_url]
).then(({rows})=> {
  return rows
})
}
