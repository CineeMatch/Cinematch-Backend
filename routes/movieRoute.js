import { createMovie, deleteMovie, getMovie, getAllMovies, updateMovie, searchMovie, getRandomMovie, getTop10Movies,getMovieRecommendations} from "../controllers/movieController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/movies").get( authMiddleware,getAllMovies);
router.route("/movie/:id").get( authMiddleware,getMovie);
router.route("/movie/create").post(authMiddleware,createMovie);
router.route("/movie/delete/:id").delete(authMiddleware,deleteMovie);
router.route("/movie/update/:id").put(authMiddleware,updateMovie);
router.route("/movie/search").post(authMiddleware, searchMovie);
router.route("/movie/top10").post(authMiddleware, getTop10Movies);
router.route("/movie/random").post(authMiddleware, getRandomMovie);
router.route("/movie/recommend").get(authMiddleware,getMovieRecommendations)
export default router;
