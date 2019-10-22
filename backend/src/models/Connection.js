require('dotenv/config');
const sequelizeFactory = require("sequelize");

const dbName = `${process.env.DB_NAME}`;
const dbUser = `${process.env.DB_USER}`;
const dbPass = `${process.env.DB_PASS}`;
const dbHost = `${process.env.DB_HOST}`;
const dbType = `${process.env.DB_TYPE}`;

const connection = new sequelizeFactory(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: dbType
})

module.exports = connection;