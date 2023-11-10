const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Insert name of photo'],
    },
    description: {
      type: String,
    },
    photo: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    category_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Photo must belong to a category'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Photo must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gallerySchema.index({ owner: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;