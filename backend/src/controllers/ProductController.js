const Connection = require("../models/Connection");
const Product = require("../models/Product");
const tablename = "products";

module.exports = {

    create(req, res) {
        const { product } = req.body;
        (product.hasOwnProperty("code")) ? delete product.code : null;

        Product.create(product).then(response => {
            res.status(200);
            res.json({ response: true, info: response });
        }).catch(error => {
            res.status(500);
            res.json({ response: false, info: error.parent.sqlMessage });
        });
    },

    read(req, res) {
        const { code } = req.params;
        Product.findByPk(code, { attributes: ["code", "description", "value"] }).then(response => {
            res.status(200);
            res.json({ response: true, info: response });
        }).catch(error => {
            res.status(500);
            res.json({ response: false, info: error.parent.sqlMessage });
        });
    },

    update(req, res) {
        const { code } = req.params;
        const { dataProduct } = req.body;

        (dataProduct.hasOwnProperty("code")) ? delete dataProduct.code : null;

        Product.update(dataProduct, { where: { code: code } }).then(response => {
            res.status(200);
            const productUpdated = response > 0 ? "Product updated successfully." : "Error updating product.";
            res.json({ response: productUpdated != null, info: productUpdated });
        }).catch(error => {
            res.status(500);
            res.json({ response: false, info: error });
        });
    },

    delete(req, res) {
        const { code } = req.params;
        Product.destroy({ where: { code: code } }).then(response => {
            res.status(200);
            const productDeleted = response > 0 ? "Product deleted successfully." : "Error deleting product.";
            res.json({ response: productDeleted != null, info: productDeleted });
        }).catch(error => {
            res.status(500);
            res.json({ response: false, info: error });
        });
    },

    list(req, res) {
        Product.findAll({ attributes: ["code", "description", "value"] }).then(response => {
            res.status(200);
            res.json({ response: true, info: response });
        }).catch(error => {
            res.status(500);
            res.json({ response: false, info: error.parent.sqlMessage });
        });
    },

    verifyTable() {
        return new Promise((resolve, reject) => {
            Connection.getQueryInterface().showAllSchemas().then(tables => {
                const existingTables = [];
                tables.forEach(table => { existingTables.push(Object.values(table)[0]) });
                if (existingTables.includes(tablename)) {
                    console.log("The products table already exists in the database.");
                    console.log("Connection OK.");
                    resolve(true);
                } else {
                    Product.sync({ force: true }).then(() => {
                        console.log("Table 'products' successfully generated.");
                        console.log("Connection OK.");
                        resolve(true);
                    }).catch(error => {
                        console.log("Error generating table 'products': ", error);
                        reject(false);
                    });
                }
            }).catch(error => {
                console.log("Error fetching registered tables: ", error);
                reject(false);
            });
        });
    }
}


