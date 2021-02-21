const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ImageSchema = new Schema({
  imageId: { type: String, required: true, index: true },
  original: { type: String, required: true },
  uploaded: { type: Date, default: Date.now },
  complete: { type: Boolean, default: false },
  images: [Object],
});

const ImageModel = model('Image', ImageSchema);

module.exports = ImageModel;