const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");


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

describe('/api', () => {
    test('responds with a 200 success code', () => {
        return request(app)
            .get("/api")
            .expect(200)
    });
    test('returns a JSON object of all the available endpoints and dynamically tests this against the actual endpoints.json object', () => {
        return request(app)
            .get("/api")
            .then(({ body }) => {
                expect(body.API_Endpoints).toEqual(endPoints);
            })
    });
});