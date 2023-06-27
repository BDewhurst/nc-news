const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

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

