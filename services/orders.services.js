const Order = require("../models/orderSchema");

const getAllOrders = async () => {
  try {
    const orders = await Order.find().populate("user").populate("games");
    if (orders) {
      return orders;
    }
  } catch (err) {
    console.log(err);
  }
};

const getOrderById = async (id) => {
  try {
    const order = await Order.findById(id).populate("games");
    if (order) {
      return order;
    }
  } catch (err) {
    console.log(err);
  }
};

const createOrder = async (order) => {
  try {
    const newOrder = new Order({
      user: order.user,
      games: order.games,
      orderNumber: order.orderNumber,
    });
    const savedOrder = await newOrder.save();
    if (savedOrder) {
      return savedOrder;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateOrder = async (id, order) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, order);
    if (updatedOrder) {
      return updatedOrder;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteOrderById = async (id) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (deletedOrder) {
      return deletedOrder;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrderById,
};
