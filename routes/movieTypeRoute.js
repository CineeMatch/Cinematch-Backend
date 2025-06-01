import { getAllMovieTypes, getFavoriteMovieTypes, getWatchedMovieTypes, getWishListMovieTypes, getMovieTypeById, createMovieType, updateMovieType, deleteMovieType } from "../controllers/movieTypeController.js";
import { getUserMovies } from "../utils/recommendationAI.js";
import { Router } from "express";

const router = Router();

router.route("/movieTypes").get(getAllMovieTypes);
router.route("/movieTypes/favorites").get(getFavoriteMovieTypes);
router.route("/movieTypes/wishlist").get(getWishListMovieTypes);
router.route("/movieTypes/watched").get(getWatchedMovieTypes);

router.route("/movieType/:id").get(getMovieTypeById);
router.route("/movieType/create").post(createMovieType);
router.route("/movieType/update/:id").put(updateMovieType);
router.route("/movieType/delete/:id").delete(deleteMovieType);

//for ai

router.route("user/:userId/movieTypes").get(getUserMovies);


export default router;
