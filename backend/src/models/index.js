const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};
