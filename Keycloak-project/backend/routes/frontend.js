const express = require("express");
const router = express.Router();

const Image = require("../models/Image");
const Post = require("../models/Post");

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
  console.log(newPost, req.body.body, req, req.body);
  return res.send({ post: newPost });
});

router.get("/images", (req, res) => {
  const accessToken = (req.headers.authorization || "").split(" ")[1] || "";
  console.log("Token", accessToken);
  Image.find(function (err, image) {
    if (err) return res.sendStatus(400);
    res.send({
      images: [...image],
    });
  });
});

router.post("/images", async (req, res) => {
  const accessToken = (req.headers.authorization || "").split(" ")[1] || "";
  console.log(accessToken);
  const image = new Image({
    ...req.body.body,
  });
  const newImage = await image.save();
  console.log(newImage);
  return res.send({ image: newImage });
});
module.exports = router;
