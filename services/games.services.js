const Game = require("../../../ApplicationBackend/models/gameSchema");

const getAllGames = async () => {
  try {
    const games = await Game.find({});
    if (games) {
      return games;
    }
  } catch (error) {}
};

const getGameById = async (id) => {
  try {
    const game = await Game.findById({ _id: id });
    if (game) {
      return game;
    }
  } catch (error) {}
};

const createGame = async (game) => {
  try {
    let imagesArray = game.images.split(",");
    const newGame = await Game.create({
      name: game.name,
      category: game.category,
      backGroundImage: game.backGroundImage,
      images: imagesArray,
      price: game.price,
      onSale: game.onSale,
      numberOfPurchase: game.numberOfPurchase,
      description: game.description,
      video: game.video,
      id: game.id,
      developers: game.developers,
      publishers: game.publishers,
      releaseDate: game.releaseDate,
    });
    const DB_game = await newGame.save();
    if (DB_game) {
      return DB_game;
    }
  } catch (error) {}
};

const updateGame = async (id, game) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(id, game);
    if (updatedGame) {
      return updatedGame;
    }
  } catch (error) {}
};

const deleteGame = async (id) => {
  try {
    await Game.findByIdAndDelete(id);
  } catch (error) {}
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
