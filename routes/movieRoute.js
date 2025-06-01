import { createMovie, deleteMovie, getMovie, getAllMovies, updateMovie, searchMovie } from "../controllers/movieController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/movies").get( authMiddleware,getAllMovies);
router.route("/movie/:id").get( authMiddleware,getMovie);
router.route("/movie/create").post(authMiddleware,createMovie);
router.route("/movie/delete/:id").delete(authMiddleware,deleteMovie);
router.route("/movie/update/:id").put(authMiddleware,updateMovie);
router.route("/movie/search").post(authMiddleware, searchMovie)
export default router;