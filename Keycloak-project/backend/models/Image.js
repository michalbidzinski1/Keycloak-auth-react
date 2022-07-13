const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  imageUrl: String,
  author: String,
  title: String,
  description: String,
});

module.exports = model("Image", imageSchema);
