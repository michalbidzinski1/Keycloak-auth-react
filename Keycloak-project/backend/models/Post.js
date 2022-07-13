const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  author: String,
  title: String,
  content: String,
});

module.exports = model("Post", postSchema);
