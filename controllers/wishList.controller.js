const wishListService = require("../services/wishList.services");
const userService = require("../services/users.services");

const getAllwishLists = async (req, res) => {
  try {
    const wishLists = await wishListService.getAllwishLists();
    res.status(200).send(wishLists);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllwishLists");
  }
};

const getWishListById = async (req, res) => {
  try {
    const { id } = req.params;
    const wishList = await wishListService.getWishListById(id);
    if (!wishList) return res.status(400).json("Wishlist not found");
    res.status(200).send(wishList);
  } catch (err) {
    res.status(400).send("Something went wrong -> getWishListById");
  }
};

const createWishList = async (req, res) => {
  try {
    const wishList = {
      user: req.body.user,
      games: req.body.games,
    };
    const newwishList = await wishListService.createWishList(wishList);
    const user = await userService.getUserById(wishList.user);
    user.wishList.push(newwishList._id);
    await userService.updateUser(user._id, user);
    res.status(200).send(newwishList);
  } catch (err) {
    res.status(400).send("Something went wrong -> createWishList");
  }
};

const updateWishList = async (req, res) => {
  try {
    const { id, remove, wishList } = req.body;
    if (!remove) {
      const oldWishList = await wishListService.getWishListById(id);
      if (oldWishList.games.includes(wishList))
        return res.status(400).json("Game already in wishlist");
      oldWishList.games.push(wishList);
      const updatedWishList = await wishListService.updateWishList(
        id,
        oldWishList
      );
      const user = await userService.getUserById(updatedWishList.user);
      await userService.updateUser(user._id, user);
      res.status(200).json("Game added to wishlist");
    } else {
      const { games } = req.body;
      const oldWishList = await wishListService.getWishListById(id);
      let newWishList = oldWishList.games.filter((game) => {
        return games.includes(game.toString());
      });

      oldWishList.games = newWishList;
      const updatedWishList = await wishListService.updateWishList(
        id,
        oldWishList
      );
      const user = await userService.getUserById(updatedWishList.user);
      await userService.updateUser(user._id, user);
      res.status(200).json("Wishlist updated");
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateWishList");
  }
};

const deleteWishList = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedwishList = await wishListService.getWishListById(id);
    const user = await userService.getUserById(deletedwishList.user);
    user.wishList.pull(deletedwishList._id);
    await userService.updateUser(user._id, user);
    await wishListService.deleteWishListById(id);
    res.status(200).send(deletedwishList);
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteWishList");
  }
};

module.exports = {
  getAllwishLists,
  getWishListById,
  createWishList,
  updateWishList,
  deleteWishList,
};
