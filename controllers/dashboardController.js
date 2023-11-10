const Gallery = require('../models/galleryModel');
const User = require('../models/userModel');
const catchAsync = require('../middlewares/catchAsync');

exports.dashboard = catchAsync(async (req, res, next) => {
  const galleryCount = await Gallery.countDocuments();
  const userCount = await User.countDocuments();

  res.status(200).json({
    users: userCount,
    gallery: galleryCount,
  });
});

exports.getDemoMode = catchAsync(async (req, res, next) => {
  res.status(200).json({
    demo: global.demo,
  });
});
