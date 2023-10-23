const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("returns 200 status code when request is successfully fullfilled. ", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("receive array of 3 topic objects and each object to have slug & description strings", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });

  test("receives 404 error status if request not found", () => {
    return request(app)
      .get("/api/topics/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found!");
      });
  });
});

describe("/api", () => {
  test("responds with a 200 success code", () => {
    return request(app).get("/api").expect(200);
  });
  test("returns a JSON object of all the available endpoints and dynamically tests this against the actual endpoints.json object", () => {
    return request(app)
      .get("/api")
      .then(({ body }) => {
        expect(body.API_Endpoints).toEqual(endPoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with a 200 success code ", () => {
    return request(app).get("/api/articles/4").expect(200);
  });

  test("returns article with correct property values", () => {
    return request(app)
      .get("/api/articles/4")
      .then(({ body }) => {
        expect(body.article.author).toBe("rogersop");
        expect(body.article.title).toBe("Student SUES Mitch!");
        expect(body.article.article_id).toBe(4);
        expect(body.article.body).toBe(
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        );
        expect(body.article.topic).toBe("mitch");
        expect(body.article.created_at).toBe("2020-05-06T01:14:00.000Z");
        expect(body.article.votes).toBe(0);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("responds with a 400 error code when an invalid article_id is requested", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Input");
      });
  });

  test("responds with a 404 error code when an article_id is requested which is not in the database", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found!");
      });
  });
});

describe("GET /api/articles", () => {
  test("Returns 200 status code ", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("Returns an array of artcle objects, each having the correct type of property", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(typeof body.articles[0]).toBe("object");
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("Should order articles by date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles", () => {
  test("Returns 200 status code ", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("Returns an array of artcle objects, each having the correct type of property", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(typeof body.articles[0]).toBe("object");
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("Should order articles by date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("receives 404 error status if request not found", () => {
    return request(app)
      .get("/api/articlesssss")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("Returns an array of artcle objects representing comments on specified article_id, each having the correct type of property", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.comments[0]).toBe("object");
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("Should order comments by date with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("responds with a 400 error code when an invalid article_id is requested", () => {
    return request(app)
      .get("/api/articles/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Input");
      });
  });
  test("responds with a 404 error code when an article_id is requested which is not in the database", () => {
    return request(app)
      .get("/api/articles/5555/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found!");
      });
  });
  test("when a request is sent with a valid article_id containing no comments, then a 200 status is sent with an empty array  ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "rogersop", body: "test comment" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("test comment");
        expect(comment.article_id).toBe(1);
        expect(comment.author).toBe("rogersop");
        expect(comment.votes).toBe(0);
      });
  });
  test("status:400, invalid article_id", () => {
    return request(app)
      .post("/api/articles/what/comments")
      .send({ author: "rogersop", body: "test comment" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid Input");
      });
  });
  test("status:404, article id not in database", () => {
    return request(app)
      .post("/api/articles/400/comments")
      .send({ author: "rogersop", body: "test comment" })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("not found");
      });
  });
  test("status: 404, username not found", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "stefano", body: "test comment" })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("not found");
      });
  });
});

describe("CORE: PATCH /api/articles/:article_id", () => {
  test("return a 200 status code and the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toEqual(1);
        expect(body.votes).toEqual(101);
        expect(typeof body.title).toBe("string");
        expect(typeof body.topic).toBe("string");
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
        expect(typeof body.article_img_url).toBe("string");
      });
  });
  test("responds with a 400 error code when an invalid article_id is requested", () => {
    return request(app)
      .patch("/api/articles/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Input");
      });
  });
  test("responds with a 404 error code when an article_id is requested which is not in the database", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found!");
      });
  });
  test("Check a 400 error is thrown if the request object property inc_votes is not a number and a response message of Invalid Input ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "I'm a string" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Input");
      });
  });
});

describe.only("DELETE /api/comments/:comment_id", () => {
  test.only("return a 204 status code and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test.only("responds with a 404 error code when an comment_id is requested which is not in the database", () => {
    return request(app)
      .delete("/api/comments/999998")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found!");
      });
  });
  test("Check a 400 error is thrown if the request object property inc_votes is not a number and a response message of Invalid Input ", () => {
    return request(app)
      .delete("/api/comments/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Input");
      });
  });
});
