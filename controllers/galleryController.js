const mongoose = require('mongoose');
const multer = require('multer');
const Gallery = require('../models/galleryModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const catchAsync = require('../middlewares/catchAsync');
const fs = require('fs');
const path = require('path');

exports.getGallery = catchAsync(async (req, res, next) => {
  const category = await Category.findOne().sort({ order: 1 });

  let filterData = {
    category_id: category._id,
  };

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const gallery = await Gallery.find(filterData).skip(skip).limit(limit).populate({
    path: 'category_id',
    select: '_id name',
  });

  const count = await Gallery.countDocuments();
  const totalPages = Math.ceil(count / limit);
  let message = '';
  if (req.query.m) {
    if (req.query.m === '1') {
      message = 'Photo added';
    } else if (req.query.m === '2') {
      message = 'Photo deleted';
    }
  }

  res.status(200).json({
    title: 'Gallery',
    gallery,
  });
});

exports.getGalleryByCategory = catchAsync(async (req, res, next) => {
  let filterData = {
    category_id: new mongoose.Types.ObjectId(req.params.id),
  };

  console.log(req.params.id);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const gallery = await Gallery.find(filterData).skip(skip).limit(limit).populate({
    path: 'category',
    select: 'name',
  });

  const count = await Gallery.countDocuments();
  const totalPages = Math.ceil(count / limit);
  let message = '';
  if (req.query.m) {
    if (req.query.m === '1') {
      message = 'Photo added';
    } else if (req.query.m === '2') {
      message = 'Photo deleted';
    }
  }

  res.status(200).json({
    title: 'Gallery',
    gallery,
  });
});

exports.addPhoto = catchAsync(async (req, res, next) => {
  let categories = await Category.find().sort({ order: 1 });

  if (!categories) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    title: 'Add gallery',
    status: 'success',
    categories,
  });
});

exports.createPhoto = catchAsync(async (req, res, next) => {
  try {
    req.body._id = new mongoose.Types.ObjectId();

    for (const file of req.files) {
      const tempPath = file.path;
      const destinationPath = path.join('./uploads/gallery', file.filename);
      fs.renameSync(tempPath, destinationPath);
    }

    for (const fileName of req.files) {
      const tempPath = fileName.path;
      const gallery = await Gallery.create({
        photo: fileName.filename,
        category_id: req.body.category_id,
      });
    }


    res.status(200).json({
      message: 'Photo successfully uploaded',
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: err,
    });
  }
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
  const doc = await Galery.findByIdAndDelete(req.body.id);

  try {
    fs.unlinkSync(`./uploads/gallery/${doc.file}`);
  } catch (err) {
    console.error('Error:', err);
  }

  await getPhotosData(res, req.body.task_id, 'Photo deleted', 'success');
  if (!doc) {
    await getPhotosData(res, req.body.task_id, 'Photo error', 'error');
  }
});

exports.updatePhoto = catchAsync(async (req, res, next) => {
  try {
    const screenshotId = req.body.id;
    const name = req.body.name;

    console.log(screenshotId);
    console.log(name);

    const screenshot = await Screenshot.findOne({ _id: screenshotId });

    if (!screenshot) {
      return res.status(404).json({
        message: 'Screenshot not found',
      });
    }

    screenshot.name = name;
    try {
      await screenshot.save();
    } catch (error) {
      console.error('Error:', error);
    }

    await getScreenshotsData(res, screenshot.task_id, 'Screenshot created', 'success');
  } catch (err) {
    await getScreenshotsData(res, screenshot.task_id, 'Screenshot error', 'error');
  }
});

exports.download = catchAsync(async (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(process.env.FILE_PATH, 'uploads/screenshots', filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error download file.' });
    }
  });
});

exports.resizeImage = catchAsync(async (req, res, next) => {
  console.log(req.files.imageCover);
  if (!req.files.imageCover) return next();

  req.body.imageCover = `project-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/projects/${req.body.imageCover}`);

  next();
});

exports.resizeGallery = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `project-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/projects/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

exports.Photo = catchAsync(async (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(process.env.FILE_PATH, 'uploads/gallery', filename);
  res.sendFile(filePath);
});
