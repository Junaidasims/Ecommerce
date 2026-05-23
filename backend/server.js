const app = require('./src/app');
const { sequelize } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to the database...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // In development, you might want to alter table definitions automatically.
    // In production, migrations are preferred. We'll use alter: true or standard sync
    // to dynamically create schema.
    const isDev = process.env.NODE_ENV === 'development';
    console.log(`Syncing database (force/alter: false)...`);
    await sequelize.sync({ force: false, alter: isDev });
    console.log('Database synchronized.');

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
