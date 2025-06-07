import { getAllMovieTypes, getFavoriteMovieTypes, getWatchedMovieTypes, getWishListMovieTypes, getMovieTypeById, createMovieType, updateMovieType, deleteMovieType } from "../controllers/movieTypeController.js";
import { getUserMovies } from "../utils/recommendationAI.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.route("/movieTypes").get(authMiddleware, getAllMovieTypes);
router.route("/movieTypes/favorites").get(authMiddleware, getFavoriteMovieTypes);
router.route("/movieTypes/wishlist").get(authMiddleware, getWishListMovieTypes);
router.route("/movieTypes/watched").get(authMiddleware, getWatchedMovieTypes);

router.route("/movieType/:id").get(authMiddleware, getMovieTypeById);
router.route("/movieType/create").post(authMiddleware, createMovieType);
router.route("/movieType/update/:id").put(authMiddleware, updateMovieType);
router.route("/movieType/delete/:id").delete(authMiddleware, deleteMovieType);

router.route("user/:userId/movieTypes").get(authMiddleware, getUserMovies);


export default router;
