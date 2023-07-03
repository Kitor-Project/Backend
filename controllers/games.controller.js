const gameService = require("../services/games.services");
const categoryService = require("../services/categories.services");
const userService = require("../services/users.services");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;

async function validateGameUpdate(req, res, next) {
  const { userId } = req.body;
  if (!userId) {
    res.status(400);
  } else {
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(400).json("Invalid user id");
    } else {
      if (user.isAdmin !== true) {
        res.status(400).json("Only admin edit/add/remove games");
      }
    }
  }

  next();
}

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

  if (userId) {
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(400).json("Invalid user id");
    } else {
      if (user.isAdmin !== true) {
        res.status(400).json("Only admin edit/add/remove games");
      }
    }
  }
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

const getAllGames = async (req, res, next) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).send(games);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllGames");
  }
};

const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await gameService.getGameById(id);
    res.status(200).send(game);
  } catch (err) {
    res.status(400).send("Something went wrong -> getGameById");
  }
};

const createGame = async (req, res, next) => {
  try {
    const game = req.body;
    const newGameID = await gameService.createGame(game);
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

const updateGame = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id, game } = req.body;
    const oldGame = await gameService.getGameById(id);
    const updatedGame = await gameService.updateGame(id, game);
    if (!updatedGame) {
      res.status(400).send("Something went wrong -> updateGame");
    } else {
      if (oldGame.category.toString() !== game.category.toString()) {
        //remove the old game from the old category
        for (const categoryID of oldGame.category) {
          const category = await categoryService.getCategoryById(categoryID);
          category.games = category.games.filter(
            (gameID) => gameID._id.toString() !== id
          );
          await categoryService.updateCategory(categoryID, category);
        }

        //add the new game to the new category
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
};
async function checkUsers(game) {
  try {
    const users = await userService.getAll();

    const gameID = game._id.toString();

    const updatePromises = [];

    for (const user of users) {
      if (user.wishlist.includes(gameID)) {
        user.wishlist = user.wishlist.filter(
          (gameID) => gameID.toString() !== gameID
        );
        updatePromises.push(userService.updateUser(user._id, user));
      }
      if (user.cart.includes(gameID)) {
        user.cart = user.cart.filter((gameID) => gameID.toString() !== gameID);
        updatePromises.push(userService.updateUser(user._id, user));
      }
      if (user.ownedGames.includes(gameID)) {
        user.ownedGames = user.ownedGames.filter(
          (gameID) => gameID.toString() !== gameID
        );
        updatePromises.push(userService.updateUser(user._id, user));
      }
    }

    await Promise.all(updatePromises);
  } catch (error) {}
}

const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.body;
    const game = await gameService.getGameById(id);
    await checkUsers(game);
    if (!game) {
      res.send("Something went wrong");
    } else {
      for (const categoryID of game.category) {
        const category = await categoryService.getCategoryById(categoryID);
        category.games = category.games.filter(
          (gameID) => gameID._id.toString() !== id
        );
        await categoryService.updateCategory(categoryID, category);
      }
    }
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
