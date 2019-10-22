require('dotenv/config');
const Express = require("express");
const Cors = require("cors");
const Routes = require("./routes");
const ProductController = require("./controllers/ProductController");

const server = Express();
server.use(Cors());
server.use(Express.urlencoded({ extended: false }));
server.use(Express.json());
server.use(Routes);

server.listen(process.env.SERVER_PORT, async () => {
    console.log("Server running...");
    await ProductController.verifyTable().catch(() => {
        console.log("Terminating server execution...");
        process.exit();
    });
});


