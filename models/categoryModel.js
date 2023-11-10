const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category must have a name'],
      unique: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    order: { type: Number, required: true, default: 1 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.post('save', (doc, next) => {
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
