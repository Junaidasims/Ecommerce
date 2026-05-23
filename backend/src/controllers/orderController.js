const { Order, Product, User } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // Array of { product_id, quantity }
    const userId = req.user.id; // req.user.id from JWT middleware

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let orderTotal = 0;
    const itemsToCreate = [];
    const productsToUpdate = [];

    // Verify all products, calculate total, check stock
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      orderTotal += itemTotal;

      itemsToCreate.push({
        product_id: product._id,
        quantity: item.quantity,
        price: product.price // Save the current price
      });

      productsToUpdate.push({
        product,
        newStock: product.stock - item.quantity
      });
    }

    // Create the order with items
    const order = await Order.create({
      user_id: userId,
      items: itemsToCreate,
      total: orderTotal,
      status: 'pending'
    });

    // Deduct stock for all products
    for (const update of productsToUpdate) {
      await Product.findByIdAndUpdate(
        update.product._id,
        { stock: update.newStock },
        { new: true }
      );
    }

    // Return created order with populated items
    const completedOrder = await Order.findById(order._id).populate('items.product_id', 'name image_url');

    res.status(201).json(completedOrder);
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .populate('items.product_id', 'name image_url')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get my orders error:', err.message);
    res.status(500).json({ message: 'Server error retrieving your orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user_id', 'username')
      .populate('items.product_id', 'name image_url')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get all orders error:', err.message);
    res.status(500).json({ message: 'Server error retrieving all orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optional: Restore stock if cancelled
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product_id);
        if (product) {
          await Product.findByIdAndUpdate(
            item.product_id,
            { stock: product.stock + item.quantity },
            { new: true }
          );
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product_id', 'name image_url');

    res.json(updatedOrder);
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
