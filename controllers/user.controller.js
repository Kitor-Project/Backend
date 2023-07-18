const userService = require("../services/users.services");

/**
 * Retrieves a user by ID.
 * Sends a response with the retrieved user.
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Something went wrong -> getUserById");
  }
};

/**
 * Retrieves a user by email.
 * Sends a response with the retrieved user if found, or null if not found.
 */
const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send(null);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> getUserByEmail");
  }
};

/**
 * Retrieves all users.
 * Sends a response with the retrieved users.
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllUsers");
  }
};

/**
 * Updates a user.
 * Sends a response with the updated user.
 * If the updated user is not found, sends an error response with a message indicating an invalid email format.
 */
const updateUser = async (req, res, next) => {
  try {
    const { id, user } = req.body;
    const updatedUser = await userService.updateUser(id, user);
    if (!updatedUser) {
      res.status(400).json({ error: "Invalid email format." });
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send("Something went wrong -> updateUser");
  }
};

/**
 * Deletes a user.
 * Sends a response with the deleted user.
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    const user = await userService.deleteUser(id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteUser");
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};
