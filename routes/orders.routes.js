// define the routs for the order of the server.

const express = require("express");
const ordersController = require("../controllers/orders.controller");
const router = express.Router();

router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.createOrder);
router.patch("/", ordersController.updateOrder);
router.delete("/", ordersController.deleteOrder);

module.exports = router;
