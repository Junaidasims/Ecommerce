const app = require('./src/app');
const { connectDB } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connection established successfully.');

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`Server is running in ${process.env.NODE_ENV || 'production'} mode`);
      console.log(`API URL: http://localhost:${PORT}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
