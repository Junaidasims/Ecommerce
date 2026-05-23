const { sequelize, Order, OrderItem, Product, User } = require('../models');

exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items } = req.body; // Array of { product_id, quantity }
    const userId = req.user.id;

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'No items in order' });
    }

    let orderTotal = 0;
    const itemsToCreate = [];
    const productsToUpdate = [];

    // Verify all products, calculate total, check stock
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      orderTotal += itemTotal;

      itemsToCreate.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price // Save the current price
      });

      productsToUpdate.push({
        product,
        newStock: product.stock - item.quantity
      });
    }

    // Create the order
    const order = await Order.create({
      user_id: userId,
      total: orderTotal,
      status: 'pending'
    }, { transaction });

    // Create order items mapped with order_id
    const orderItems = itemsToCreate.map(item => ({
      ...item,
      order_id: order.id
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    // Deduct stock for all products
    for (const update of productsToUpdate) {
      await update.product.update({ stock: update.newStock }, { transaction });
    }

    await transaction.commit();

    // Return created order with items
    const completedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
        }
      ]
    });

    res.status(201).json(completedOrder);
  } catch (err) {
    await transaction.rollback();
    console.error('Create order error:', err.message);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error('Get my orders error:', err.message);
    res.status(500).json({ message: 'Server error retrieving your orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
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

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optional: Restore stock if cancelled
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const items = await OrderItem.findAll({ where: { order_id: order.id } });
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          await product.update({ stock: product.stock + item.quantity });
        }
      }
    }

    await order.update({ status });
    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
