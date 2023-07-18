// define the routs and the actions for a point object.

const express = require("express");
const router = express.Router();
const Point = require("../models/pointSchema");

// Save a new point
router.post("/", (req, res) => {
  const { name, latitude, longitude } = req.body;

  const newPoint = new Point({
    name,
    latitude,
    longitude,
  });

  newPoint
    .save()
    //if save method successed
    .then(() => res.status(201).json({ message: "Point saved successfully" }))
    // else
    .catch((error) =>
      res
        .status(500)
        .json({ error: "An error occurred while saving the point" })
    );
});

// Get all points
router.get("/", (req, res) => {
  Point.find()
    .then((points) => res.json(points))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "An error occurred while retrieving points" })
    );
});

module.exports = router;
