const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom_db';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { mongoose, connectDB };
