const mongoose = require('mongoose');
const moment = require('moment');
const Gallery = require('../models/galleryModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const catchAsync = require('../middlewares/catchAsync');

exports.getGallery = catchAsync(async (req, res, next) => {
  const category = await Category.findOne().sort({ order: 1 });

  let filterData = {
    category_id: category._id,
  };

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

/*
async function getPhotoData(res, taskId, title, status) {
  try {
    let filterData = { task_id: taskId };
    const screenshots = await Gallery.find(filterData).sort('-createdAt');
    res.status(200).json({
      title: title,
      status: status,
      screenshots,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
*/

exports.createPhoto = catchAsync(async (req, res, next) => {
  try {
    req.body._id = new mongoose.Types.ObjectId();
    req.body.owner = res.locals.user._id;

    const screenshotNames = req.files.map((file) => file.originalname);

    for (const file of req.files) {
      const tempPath = file.path;
      const destinationPath = path.join('./uploads/screenshots', file.filename);
      fs.renameSync(tempPath, destinationPath);
    }

    for (const fileName of req.files) {
      const tempPath = fileName.path;

      const screenshot = await Screenshot.create({
        name: req.body.name,
        file: fileName.filename,
        owner: req.body.owner,
        task_id: req.body.task_id,
        project_id: req.body.project_id,
        owner: res.locals.user._id,
      });
    }

    await getScreenshotsData(res, req.body.task_id, 'Screenshot created', 'success');
  } catch (err) {
    console.log(err);
    await getScreenshotsData(res, req.body.task_id, 'Screenshot error', 'error');
  }
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
  const doc = await Screenshot.findByIdAndDelete(req.body.id);

  try {
    fs.unlinkSync(`./uploads/screenshot/${doc.file}`);
  } catch (err) {
    console.error('Error:', err);
  }

  await getScreenshotsData(res, req.body.task_id, 'Screenshot deleted', 'success');
  if (!doc) {
    await getScreenshotsData(res, req.body.task_id, 'Screenshot error', 'error');
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
  const filePath = path.join(process.env.FILE_PATH, 'uploads/screenshots', filename);
  res.sendFile(filePath);
});
