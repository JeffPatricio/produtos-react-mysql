const Sequelize = require("sequelize");
const Connection = require("./Connection");

const Product = Connection.define('products', {
    code: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    value: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

module.exports = Product;