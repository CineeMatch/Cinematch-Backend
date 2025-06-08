import { getAllMovieTypes, getFavoriteMovieTypes, getWatchedMovieTypes, getWishListMovieTypes, getMovieTypeById, createandUpdateMovieType, deleteMovieType } from "../controllers/movieTypeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.route("/movieTypes").get(authMiddleware, getAllMovieTypes);
router.route("/movieTypes/favorites").get(authMiddleware, getFavoriteMovieTypes);
router.route("/movieTypes/wishlist").get(authMiddleware, getWishListMovieTypes);
router.route("/movieTypes/watched").get(authMiddleware, getWatchedMovieTypes);

router.route("/movieType/:id").get(authMiddleware, getMovieTypeById);
router.route("/movieType/create").post(authMiddleware, createandUpdateMovieType);
router.route("/movieType/delete/:id").delete(authMiddleware, deleteMovieType);


export default router;
