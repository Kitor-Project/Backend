const categoryService = require("../services/categories.services");
const gameService = require("../services/games.services");

// Retrieves all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(); // Retrieve categories using categoryService
    res.status(200).send(categories); // Send response to front server with status 200 and retrieved categories
  } catch (err) {
    res.status(400).send("Something went wrong -> getCategories"); // If an error occurs, send response with status 400 and error message
  }
};

// Retrieves a category by name
const getCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.params; // Extract the 'name' parameter from request params
    const category = await categoryService.getCategoryByName(name); // Retrieve category by name using categoryService
    res.status(200).send(category); // Send response with status 200 and retrieved category
  } catch (err) {
    res.status(400).send("Something went wrong -> getCategoryByName"); // If an error occurs, send response with status 400 and error message
  }
};

// Creates a new category
const createCategory = async (req, res, next) => {
  try {
    const { category } = req.body; // Extract the 'category' object from request body
    const newCategoryID = await categoryService.createCategory(category); // Create a new category using categoryService and get the new category's ID
    if (newCategoryID) {// If the new category is successfully created
      for (const gameID of category.games) {
        // Iterate over the 'games' array in the category object
        const game = await gameService.getGameById(gameID); // Retrieve the game by ID using gameService
        game.category.push(newCategoryID); // Add the new category ID to the 'category' array of the game
        await gameService.updateGame(gameID, game); // Update the game with the modified category
      }
      res.status(200).send(newCategoryID); // Send response with status 200 and the new category's ID
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> createCategory"); // If an error occurs, send response with status 400 and error message
  }
};

// Updates a category
const updateCategory = async (req, res, next) => {
  try {
    const { id, category } = req.body; // Extract the 'id' and 'category' object from request body
    const updatedCategory = await categoryService.updateCategory(id, category); // Update the category using categoryService and get the updated category
    if (updatedCategory) {
      // If the category is successfully updated
      for (const gameID of updatedCategory.games) {
        // Iterate over the 'games' array in the updated category object
        const game = await gameService.getGameById(gameID._id); // Retrieve the game by ID using gameService
        game.category.push(updatedCategory._id); // Add the updated category ID to the 'category' array of the game
        await gameService.updateGame(gameID, game); // Update the game with the modified category
      }
      res.status(200).send(updatedCategory); // Send response with status 200 and the updated category
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateCategory"); // If an error occurs, send response with status 400 and error message
  }
};

// Deletes a category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.body; // Extract the 'id' from request body
    const deletedCategory = await categoryService.getCategoryById(id); // Retrieve the category by ID using categoryService
    if (deletedCategory) {
      // If the category is found
      for (const gameID of deletedCategory.games) {
        // Iterate over the 'games' array in the deleted category object
        const game = await gameService.getGameById(gameID._id); // Retrieve the game by ID using gameService
        game.category = game.category.filter(
          (categoryID) => categoryID._id.toString() !== id
        ); // Remove the deleted category ID from the 'category' array of the game
        await gameService.updateGame(gameID, game); // Update the game with the modified category
      }
      await categoryService.deleteCategory(id); // Delete the category using categoryService
    }
    res.status(200).send(deletedCategory); // Send response with status 200 and the deleted category
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteCategory"); // If an error occurs, send response with status 400 and error message
  }
};

module.exports = {
  getCategories,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
