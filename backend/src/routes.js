const Express = require("express");
const Routes = Express.Router();
const ProductController = require("./controllers/ProductController");

Routes.post("/new/product", ProductController.create);

Routes.get("/read/products", ProductController.list);

Routes.get("/read/product/:code", ProductController.read);

Routes.put("/update/product/:code", ProductController.update);

Routes.delete("/delete/product/:code", ProductController.delete);

Routes.get("/", (req, res) => { res.send("<h3>Server running...</h3>"); });

module.exports = Routes;