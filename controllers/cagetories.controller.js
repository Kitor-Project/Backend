const categoryService = require("../services/categories.services");
const gameService = require("../services/games.services");

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).send(categories);
  } catch (err) {
    res.status(400).send("Something went wrong -> getCategories");
  }
};

const getCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const category = await categoryService.getCategoryByName(name);
    res.status(200).send(category);
  } catch (err) {
    res.status(400).send("Something went wrong -> getCategoryByName");
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const newCategoryID = await categoryService.createCategory(category);
    if (newCategoryID) {
      for (const gameID of category.games) {
        const game = await gameService.getGameById(gameID);
        game.category.push(newCategoryID);
        await gameService.updateGame(gameID, game);
      }
      res.status(200).send(newCategoryID);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> createCategory");
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id, category } = req.body;
    const updatedCategory = await categoryService.updateCategory(id, category);
    if (updatedCategory) {
      for (const gameID of updatedCategory.games) {
        const game = await gameService.getGameById(gameID._id);
        game.category.push(updatedCategory._id);
        await gameService.updateGame(gameID, game);
      }
      res.status(200).send(updatedCategory);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateCategory");
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.body;
    const deletedCategory = await categoryService.getCategoryById(id);
    if (deletedCategory) {
      for (const gameID of deletedCategory.games) {
        const game = await gameService.getGameById(gameID._id);
        game.category = game.category.filter(
          (categoryID) => categoryID._id.toString() !== id
        );
        await gameService.updateGame(gameID, game);
      }
      await categoryService.deleteCategory(id);
    }
    res.status(200).send(deletedCategory);
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteCategory");
  }
};

module.exports = {
  getCategories,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
