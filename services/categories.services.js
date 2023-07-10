const Category = require("../models/categorySchema");

const getCategories = async () => {
  try {
    const categories = await Category.find().populate("games");
    if (categories) {
      return categories;
    }
  } catch (error) {
    console.log(error);
  }
};

const getCategoryByName = async (name) => {
  try {
    const category = await Category.findOne({ name }).populate("games");
    if (category) {
      return category;
    }
  } catch (error) {
    console.log(error);
  }
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
    const DB_Catalog = await newCategory.save();
    if (DB_Catalog) {
      return DB_Catalog;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateCategory = async (id, category) => {
  try {
    const updatedCatalog = await Category.findByIdAndUpdate(id, category);
    if (updatedCatalog) {
      return updatedCatalog;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (id) => {
  try {
    const deletedCatalog = await Category.findByIdAndDelete(id);
    if (deletedCatalog) {
      return deletedCatalog;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCategories,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
