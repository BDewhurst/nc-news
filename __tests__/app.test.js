const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const jsonInfo = require("../endpoints.json")
const toBeSortedBy = require('jest-sorted');

beforeEach(() => {
    return seed(data);
});
afterAll(() => {
    return db.end();
});

describe("GET /api/topics", () => {
    test("200 responds with an array of all topics", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const topics = body;
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String))
                    expect(topic).toHaveProperty("description", expect.any(String))
                })
            })
    })
    test(`404: responds with bad request for an invalid topics path`, () => {
        return request(app)
            .get("/api/topiics")
            .expect(404)
            .then(({ body }) => {


                expect(body.message).toBe(`No Path Found`)
            })
    })
})
describe("GET /api", () => {
    test("200 responds with an description of all Apis", () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(jsonInfo)
            })
    })
})
describe("GET /api/articles/articleid", () => {
    test("200 responds with an article ", () => {
        return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveLength(1)
                expect(body.article[0]).toHaveProperty("topic", expect.any(String))
                expect(body.article[0]).toHaveProperty("author", expect.any(String))
                expect(body.article[0]).toHaveProperty("title", expect.any(String))
                expect(body.article[0]).toHaveProperty("body", expect.any(String))
                expect(body.article[0]).toHaveProperty("created_at", expect.any(String))
                expect(body.article[0]).toHaveProperty("votes", expect.any(Number))
                expect(body.article[0]).toHaveProperty("article_img_url", expect.any(String))
            })
    })
    test("404 responds with specific message", () => {
        return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual('No article found for article_id: 9999')
            })
    })
    test("400 bad request", () => {
        return request(app)
            .get('/api/articles/nonsense')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual('Invalid input')
            })
    })
})
describe("GET /api/articles", () => {
    test("200 responds with an array articles with all properties including comment count excluding body", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(13)
                expect(body.articles[0]).toHaveProperty("comment_count", expect.any(String))
                expect(body.articles[2]).toHaveProperty("comment_count", expect.any(String))
                expect(body.articles[0]).toHaveProperty("topic", expect.any(String))
                expect(body.articles[0]).toHaveProperty("author", expect.any(String))
                expect(body.articles[0]).toHaveProperty("title", expect.any(String))
                expect(body.articles[0]).toHaveProperty("created_at", expect.any(String))
                expect(body.articles[0]).toHaveProperty("votes", expect.any(Number))
                expect(body.articles[0]).toHaveProperty("article_img_url", expect.any(String))
                expect(body.articles[0]).not.toHaveProperty("body")
            })
    })
    test("200 responds with an array of all articles sorted by date in descending order", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', {
                    descending: true,
                });
            })
    })
})
describe("GET /api/articles/:articleid/comments", () => {
    test("200 responds with comments", () => {
        return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toHaveLength(2)
                body.comments.forEach(comment => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number))
                    expect(comment).toHaveProperty("author", expect.any(String))
                    expect(comment).toHaveProperty("article_id", expect.any(Number))
                    expect(comment).toHaveProperty("body", expect.any(String))
                    expect(comment).toHaveProperty("created_at", expect.any(String))
                    expect(comment).toHaveProperty("votes", expect.any(Number))
                })
            })
    })
    test("200 responds with an array of all comments sorted by date in descending order", () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeSortedBy('created_at', {
                    descending: false,
                });
            })
    })
    test("200 responds with empty array if no comments on specific article", () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            })
    })
    test("404 valid input but no article", () => {
        return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual("No article found for article_id: 9999")
            })
    })
    test("404 invalid input for article", () => {
        return request(app)
            .get('/api/articles/nonsense/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual("Invalid input")
            })
    })
})


describe("POST /api/articles/:articleid/comments", () => {
    test("200 responds with comments", () => {
        const testComment = {
            author: 'SteveSidwell',
            body: 'Capitain Fantastic',
            name: 'Steve',
            username: 'SteveSidwell'
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(testComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toHaveLength(1)
                expect(body.comment[0]).toHaveProperty("author", expect.any(String))
                expect(body.comment[0]).toHaveProperty("body", expect.any(String))
            })
    })
    test("400 invalid input for article", () => {
        const testComment = {
        author: 'SteveSidwell',
        body: 'Capitain Fantastic',
        name: 'Steve',
        username: 'SteveSidwell'
    };
        return request(app)
        .post('/api/articles/nonsense/comments')
        .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual("Invalid input")
            })
    })
    test("400 invalid user input for article", () => {
        const testComment = {
        body: 'Capitain Fantastic',
        name: 'Steve',
        username: 'SteveSidwell'
    };
        return request(app)
        .post('/api/articles/10/comments')
        .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual("Invalid input")
            })
    })
})
