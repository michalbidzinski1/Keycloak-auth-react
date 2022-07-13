const express = require("express");
const router = express.Router();
const axios = require("axios");

const Image = require("../models/Image");
const Post = require("../models/Post");
var bodyParser = require("body-parser");
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);
const introspectionEndpoint =
  "http://localhost:8080/realms/myapprealm/protocol/openid-connect/token/introspect";

const webClientId = "webclient";
const webClientSecret = "9vsZb1RRGahXT6ZwkZ6hfdLLRHvqLafq";

router.get("/images", (req, res) => {
  const accessToken = (req.headers.authorization || "").split(" ")[1] || "";
  const params = new URLSearchParams();
  params.append("client_id", webClientId);
  params.append("client_secret", webClientSecret);
  params.append("token", accessToken);

  return axios
    .post(introspectionEndpoint, params)
    .then((result) => {
      console.log("Introspection");
      console.log(result);
      res.set("Content-Type", "application/json");

      if (result.data.active == true) {
        Image.find(function (err, images) {
          if (err) return res.sendStatus(400);
          res.send({
            images: [...images],
          });
        });
      } else {
        res.send({
          error: "Invalid/Unactive token",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify({ error: "Error" }));
    });
});

router.post("/images", (req, res) => {
  const accessToken = (req.headers.authorization || "").split(" ")[1] || "";

  const params = new URLSearchParams();
  params.append("client_id", webClientId);
  params.append("client_secret", webClientSecret);
  params.append("token", accessToken);

  return axios
    .post(introspectionEndpoint, params)
    .then((result) => {
      res.set("Content-Type", "application/json");
      if (result.data.active === true) {
        const image = new Image({
          ...req.body,
        });
        const newImage = image.save();
        return res.send(newImage);
      } else {
        res.status(401);
        res.send({
          error: "Invalid token",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify({ error: "Error" }));
    });
});

router.get("/posts", (req, res) => {
  Post.find(function (err, posts) {
    if (err) return res.sendStatus(400);
    res.send({
      posts: [...posts],
    });
  });
});

router.post("/posts", async (req, res) => {
  console.log(req, req.payload);
  const post = new Post({
    ...req.body,
  });
  const newPost = await post.save();

  return res.send({ post: newPost });
});
module.exports = router;
