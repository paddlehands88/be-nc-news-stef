const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})


describe('GET /api/topics', () => {
    test('returns 200 status code when request is successfully fullfilled. ', () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
    });

    test('receive array of 3 topic objects and each object to have slug & description strings', () => {
        return request(app)
            .get("/api/topics")
            .then(({ body }) => {
                expect(body.topics).toHaveLength(3);
                body.topics.forEach((topic) => {
                    expect(typeof(topic.slug)).toBe('string')
                    expect(typeof(topic.description)).toBe('string')
                })
            })
    });

    test('receives 404 error status if request not found', () => {
        return request(app)
            .get("/api/topics/notARoute")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('Path not found!');
            });

    });
});