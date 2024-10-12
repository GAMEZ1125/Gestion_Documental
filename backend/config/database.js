// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Import .env file

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false,
    },
);

module.exports = sequelize;