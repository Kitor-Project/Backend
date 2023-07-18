const gameService = require("../services/games.services");
const categoryService = require("../services/categories.services");
const userService = require("../services/users.services");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;

/**
 * Middleware to validate game updates.
 * Checks if the requesting user is an admin.
 */
async function validateGameUpdate(req, res, next) {
  const { userId } = req.body;

  // Check if the 'userId' is provided
  if (!userId) {
    res.status(400);
  } else {
    const user = await userService.getUserById(userId);

    // Check if the user exists
    if (!user) {
      res.status(400).json("Invalid user id");
    } else {
      // Check if the user is an admin
      if (user.isAdmin !== true) {
        res.status(400).json("Only admin can edit/add/remove games");
      }
    }
  }

  next();
}

/**
 * Middleware to validate game creation.
 * Checks if all required fields are provided and if the requesting user is an admin.
 */
async function validateGame(req, res, next) {
  const {
    userId,
    name,
    developers,
    publishers,
    releaseDate,
    images,
    video,
    backGroundImage,
    category,
    price,
    description,
  } = req.body;

  // Check if the 'userId' is provided
  if (userId) {
    const user = await userService.getUserById(userId);

    // Check if the user exists
    if (!user) {
      res.status(400).json("Invalid user id");
    } else {
      // Check if the user is an admin
      if (user.isAdmin !== true) {
        res.status(400).json("Only admin can edit/add/remove games");
      }
    }
  }

  // Check if all required fields are provided
  if (
    !name ||
    !developers ||
    !publishers ||
    !releaseDate ||
    !images ||
    !video ||
    !backGroundImage ||
    !category ||
    !price ||
    !description
  ) {
    res.status(400).json("Missing required fields");
  }

  next();
}

/**
 * Retrieves all games.
 * Sends a response to front server with the retrieved games.
 */
const getAllGames = async (req, res, next) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).send(games);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllGames");
  }
};

/**
 * Retrieves a game by ID - we send an id and returns the game.
 * Sends a response with the retrieved game.
 */
const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await gameService.getGameById(id);
    res.status(200).send(game);
  } catch (err) {
    res.status(400).send("Something went wrong -> getGameById");
  }
};

/**
 * Creates a new game.
 * Adds the new game to the appropriate category and sends a response with the new game ID.
 */
const createGame = async (req, res, next) => {
  try {
    const game = req.body;
    const newGameID = await gameService.createGame(game);

    // If the new game was not created successfully
    if (!newGameID) {
      res.status(400).send("Something went wrong");
    } else {
      const convertedCategoryID = new ObjectId(game.category);
      const category = await categoryService.getCategoryById(
        convertedCategoryID
      );
      category.games.push(newGameID);
      await categoryService.updateCategory(convertedCategoryID, category);
      res.status(200).send(newGameID);
    }
  } catch (err) {
    res
      .status(402)
      .send("All fields are required / Invalid input. -> createGame");
  }
};

/**
 * Updates a game.
 * Handles the update of the game and its associated categories.
 * Sends a response with the updated game.
 */
const updateGame = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id, game } = req.body;
    const oldGame = await gameService.getGameById(id);
    const updatedGame = await gameService.updateGame(id, game);

    // If the game was not updated successfully
    if (!updatedGame) {
      res.status(400).send("Something went wrong -> updateGame");
    } else {
      // If the game's category has changed
      if (oldGame.category.toString() !== game.category.toString()) {
        // Remove the old game from the old categories
        for (const categoryID of oldGame.category) {
          const category = await categoryService.getCategoryById(categoryID);
          category.games = category.games.filter(
            (gameID) => gameID._id.toString() !== id
          );
          await categoryService.updateCategory(categoryID, category);
        }

        // Add the updated game to the new categories
        for (const categoryID of game.category) {
          const category = await categoryService.getCategoryById(categoryID);
          category.games.push(id);
          await categoryService.updateCategory(categoryID, category);
        }
      }
      res.status(200).send(updatedGame);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateGame");
  }
}

/**
 * Helper function to check and update user data related to a game.
 */
async function checkUsers(game) {
  try {
    const users = await userService.getAll();
    const gameID = game._id.toString();
    const updatePromises = [];

    // Iterate over all users
    for (const user of users) {
      // Check if the game is in the user's wishlist
      if (user.wishlist.includes(gameID)) {
        user.wishlist = user.wishlist.filter(
          (gameID) => gameID.toString() !== gameID
        );
        updatePromises.push(userService.updateUser(user._id, user));
      }
      // Check if the game is in the user's cart
      if (user.cart.includes(gameID)) {
        user.cart = user.cart.filter((gameID) => gameID.toString() !== gameID);
        updatePromises.push(userService.updateUser(user._id, user));
      }
      // Check if the user owns the game
      if (user.ownedGames.includes(gameID)) {
        user.ownedGames = user.ownedGames.filter(
          (gameID) => gameID.toString() !== gameID
        );
        updatePromises.push(userService.updateUser(user._id, user));
      }
    }

    await Promise.all(updatePromises);
  } catch (error) {
    // Handle any errors that occur during user data update
  }
}

/**
 * Deletes a game.
 * Handles the removal of the game from associated categories and user data.
 * Sends a response with a success message.
 */
const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.body;
    const game = await gameService.getGameById(id);

    // Update user data related to the game
    await checkUsers(game);

    // If the game was not found
    if (!game) {
      res.send("Something went wrong");
    } else {
      // Remove the game from its associated categories
      for (const categoryID of game.category) {
        const category = await categoryService.getCategoryById(categoryID);
        category.games = category.games.filter(
          (gameID) => gameID._id.toString() !== id
        );
        await categoryService.updateCategory(categoryID, category);
      }
    }

    // Delete the game
    await gameService.deleteGame(id);

    res.status(200).send("Game deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteGame");
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  validateGame,
  validateGameUpdate,
};
