const express = require('express');
const galleryController = require('../controllers/galleryController');
const authController = require('../controllers/authController');
const demoMode = require('../middlewares/demo_mode');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/gallery');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.use(authController.protect);

router.route('/gallery').get(authController.protect, galleryController.getGallery);
router.route('/gallery/:id').get(authController.protect, galleryController.getGalleryByCategory);

//router.route('/photo/:id').get(demoMode, authController.protect, galleryController.getPhoto);

router.route('/add/gallery/').post(demoMode, authController.protect, upload.any(), galleryController.createPhoto);
/*
router
  .route('/edit/gallery/:id')
  .get(demoMode, authController.protect, galleryController.editPhoto)
  .post(demoMode, authController.protect, galleryController.updatePhoto);
*/
router.route('/gallery/delete/:id').post(demoMode, authController.protect, galleryController.deletePhoto);

module.exports = router;