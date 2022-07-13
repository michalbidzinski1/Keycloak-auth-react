const express = require("express");
const router = express.Router();
const axios = require("axios");

const Image = require("../models/Image");
const Post = require("../models/Post");

router.use(express.json());

const introspectionEndpoint =
  "http://localhost:8080/realms/myapprealm/protocol/openid-connect/token/introspect";

const integrationClientId = "backend";
const integrationClientSecret = "dVcNnmSzNmNMC5qNGULg25PRVE5OQHsS";

router.get("/images", (req, res) => {
  const accessToken = (req.headers.authorization || "").split(" ")[1] || "";
  console.log("access token", accessToken);
  const params = new URLSearchParams();
  params.append("client_id", integrationClientId);
  params.append("client_secret", integrationClientSecret);
  params.append("token", accessToken);

  return axios
    .post(introspectionEndpoint, params)
    .then((result) => {
      console.log("Introspection result");
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
      res.send(
        JSON.stringify({ error: "Error not connected with active token" })
      );
    });
});

router.post("/images", (req, res) => {
  const accessToken = (req.headers.authorization || "").split(" ")[1] || "";
  const params = new URLSearchParams();
  params.append("client_id", integrationClientId);
  params.append("client_secret", integrationClientSecret);
  params.append("token", accessToken);
  return axios
    .post(introspectionEndpoint, params)
    .then(async (result) => {
      console.log("Introspection result");
      console.log(result);
      res.set("Content-Type", "application/json");
      console.log("----------------------");
      console.log(req.body.body);
      const image = new Image({
        ...req.body.body,
      });
      const newImage = await image.save();
      console.log(newImage);
      return res.send({ image: newImage });
    })
    .catch((err) => {
      console.log(err);
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
  const post = new Post({
    ...req.body.body,
  });
  const newPost = await post.save();
  console.log(newPost);
  return res.send({ post: newPost });
});

module.exports = router;
