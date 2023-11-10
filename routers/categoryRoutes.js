const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const demoMode = require('../middlewares/demo_mode');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/categories').get(authController.protect, categoryController.getCategories);
router.route('/add/category').post(demoMode, authController.protect, categoryController.createCategory);

router
  .route('/category/:id')
  .get(demoMode, authController.protect, categoryController.editCategory)
  .post(demoMode, authController.protect, categoryController.updateCategory);

router.route('/category/delete/:id').post(demoMode, authController.protect, categoryController.deleteCategory);

module.exports = router;
