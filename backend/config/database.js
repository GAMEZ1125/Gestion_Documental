// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Importar el archivo .env

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false,
        timezone: '-05:00', // Usar el desplazamiento UTC para Colombia (UTC-5)
        dialectOptions: {
            // Eliminar useUTC
            dateStrings: true,
            typeCast: function (field, next) {
                if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
                    return field.string();
                }
                return next();
            },
        },
    }
);

module.exports = sequelize;