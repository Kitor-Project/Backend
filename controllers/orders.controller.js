const orderService = require("../services/orders.services");
const userService = require("../services/users.services");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).send(orders);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllOrders");
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send("Something went wrong -> getOrderById");
  }
};

const createOrder = async (req, res) => {
  try {
    const { order } = req.body;
    const newOrder = await orderService.createOrder(order);
    const user = await userService.getUserById(order.user);
    user.orders.push(newOrder._id);
    await userService.updateUser(user._id, user);
    res.status(200).send(newOrder);
  } catch (err) {
    res.status(400).send("Something went wrong -> createOrder");
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id, order } = req.body;
    const updatedOrder = await orderService.updateOrder(id, order);
    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(400).send("Something went wrong -> updateOrder");
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedOrder = await orderService.getOrderById(id);
    const user = await userService.getUserById(deletedOrder.user);
    user.orders.pull(deletedOrder._id);
    await userService.updateUser(user._id, user);
    await orderService.deleteOrderById(id);
    res.status(200).send(deletedOrder);
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteOrder");
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
