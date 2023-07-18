// Pull users data from DB 

// define the ref to users schema
const User = require("../models/userSchema");

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email }).populate("orders");
  return user;
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getAll = async () => {
  try {
    const users = await User.find();
    if (users) {
      return users;
    }
  } catch (err) {}
};

const updateUser = async (id, user) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user);
    if (updatedUser) {
      return updatedUser;
    }
  } catch (error) {}
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      return deletedUser;
    }
  } catch (error) {}
};

module.exports = {
  getUserByEmail,
  getUserById,
  updateUser,
  getAll,
  deleteUser,
};
