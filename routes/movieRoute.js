import { createMovie, deleteMovie, getMovie, getMovies, updateMovie } from "../controllers/movieController.js";
import express from "express";

const router = express.Router();

router.route("/movies").get( getMovies);
router.route("/movie/:id").get( getMovie);
router.route("/movie/create").post(createMovie);
router.route("/movie/delete").delete(deleteMovie);
router.route("/movie/update").put(updateMovie);

export default router;