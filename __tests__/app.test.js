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
        expect(body.message).toBe("Path not found!");
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
        expect(body.message).toBe("No user found for article_id: 9999");
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
        expect(body.message).toBe("Path not found!");
      });
  });
});

//QU 7 TESTING

describe.only("POST /api/articles/:article_id/comments", () => {
  test("Returns status 201 with username, body string and comment_id", () => {
    const newComment = {
      body: "This is the comment body",
      userName: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment.body).toEqual("This is the comment body");
        expect(comment.author).toEqual("butter_bridge");
        expect(comment.votes).toEqual(0);
        expect(typeof comment.created_at).toBe("string");
        expect(comment.article_id).toEqual(1);
      });
  });
  test("returns 404 when username does not exist", () => {
    const newComment = {
      body: "This is the comment body",
      userName: "USER999",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("not found");
      });
  });

  test("returns 404 not found when article_id is not found", () => {
    const newComment = {
      body: "This is the comment body",
      userName: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("not found");
      });
  });

  test("returns 400 when newComment object is empty", () => {
    const newComment = {};

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid Input");
      });
  });

  test("returns 400 Invalid Input when article_id is not a number", () => {
    const newComment = {
      body: "This is the comment body",
      userName: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/sausages/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid Input");
      });
  });
});
