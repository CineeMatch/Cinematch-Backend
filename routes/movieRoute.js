import { createMovie, deleteMovie, getMovie, getAllMovies, updateMovie } from "../controllers/movieController.js";
import express from "express";

const router = express.Router();

router.route("/movies").get( getAllMovies);
router.route("/movie/:id").get( getMovie);
router.route("/movie/create").post(createMovie);
router.route("/movie/delete/:id").delete(deleteMovie);
router.route("/movie/update/:id").put(updateMovie);

export default router;