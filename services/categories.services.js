// Pull categories data from DB 

// define the ref to category schema
const Category = require("../models/categorySchema");

// async function (get future).
// find - brings me the json of categories objects from mongo.
// populate will bring the actual game object from the id
const getCategories = async () => {
  try {
    const categories = await Category.find().populate("games");
    if (categories) {
      return categories;
    }
  } catch (error) {}
};

const getCategoryByName = async (name) => {
  try {
    const category = await Category.findOne({ name }).populate("games");
    if (category) {
      return category;
    }
  } catch (error) {}
};

const getCategoryById = async (id) => {
  try {
    const category = await Category.findById({ _id: id }).populate("games");
    if (category) {
      return category;
    }
  } catch (error) {
    console.log(error);
  }
};

const createCategory = async (category) => {
  try {
    const newCategory = new Category({
      name: category.name,
      games: category.games,
    });
    // Try to save the new category on the DB
    const DB_Catalog = await newCategory.save();
    if (DB_Catalog) {
      return DB_Catalog;
    }
  } catch (error) {}
};

const updateCategory = async (id, category) => {
  try {
    const updatedCatalog = await Category.findByIdAndUpdate(id, category);
    if (updatedCatalog) {
      return updatedCatalog;
    }
  } catch (error) { }
};

const deleteCategory = async (id) => {
  try {
    const deletedCatalog = await Category.findByIdAndDelete(id);
    if (deletedCatalog) {
      return deletedCatalog;
    }
  } catch (error) { }
};

module.exports = {
  getCategories,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
