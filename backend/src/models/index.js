const { mongoose, connectDB } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

module.exports = {
  mongoose,
  connectDB,
  User,
  Product,
  Order,
};
