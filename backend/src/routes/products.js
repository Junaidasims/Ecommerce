const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.post('/', auth, adminOnly, productController.createProduct);
router.put('/:id', auth, adminOnly, productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);

module.exports = router;
