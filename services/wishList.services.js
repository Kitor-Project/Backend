const WishList = require("../models/wishListSchema");

const getAllwishLists = async () => {
  try {
    const wishLists = await WishList.find().populate("user").populate("games");
    if (wishLists) {
      return wishLists;
    }
  } catch (error) {
    console.log(error);
  }
};

const getWishListById = async (id) => {
  try {
    const wishList = await WishList.findById(id);
    if (wishList) {
      return wishList;
    }
  } catch (error) {}
};

const createWishList = async (wishList) => {
  try {
    const newWishList = new WishList({
      user: wishList.user,
      games: wishList.games,
    });
    const savedwishList = await newWishList.save();
    if (savedwishList) {
      return savedwishList;
    }
  } catch (error) {
    console.log(error);
  }
};
const updateWishList = async (id, wishList) => {
  try {
    const updatedwishList = await WishList.findByIdAndUpdate(
      { _id: id },
      wishList
    );
    if (updatedwishList) {
      return updatedwishList;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteWishListById = async (id) => {
  try {
    const deletedwishList = await WishList.findByIdAndDelete(id);
    if (deletedwishList) {
      return deletedwishList;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllwishLists,
  getWishListById,
  createWishList,
  updateWishList,
  deleteWishListById,
};
