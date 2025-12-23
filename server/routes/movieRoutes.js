import express from "express";
import fs from "fs";
import path from "path";

const movieRouter = express.Router();

// GET all movies from local JSON
movieRouter.get("/", (req, res) => {
  try {
    const filePath = path.resolve("data", "movies.json");
    const jsonData = fs.readFileSync(filePath);
    const movies = JSON.parse(jsonData);
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Error fetching movies" });
  }
});

export default movieRouter;
