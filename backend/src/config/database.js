const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'ecom_db';

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries in development
  dialectOptions: {
    // If you are using SSL (e.g. for cloud providers like PlanetScale), uncomment below
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
