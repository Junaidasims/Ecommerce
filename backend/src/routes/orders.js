const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// All order routes require authentication
router.use(auth);

// User specific routes
router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);

// Admin-only routes
router.get('/', adminOnly, orderController.getAllOrders);
router.put('/:id/status', adminOnly, orderController.updateOrderStatus);

module.exports = router;
