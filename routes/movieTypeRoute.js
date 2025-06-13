import { getAllMovieTypes, getFavoriteMovieTypes, getWatchedMovieTypes, getWishListMovieTypes, getMovieTypeById, createandUpdateMovieType, deleteMovieType, isOnProfileMovieType, getUserMovieTypesCounts,getUserMovieTypesbyUser } from "../controllers/movieTypeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.route("/movieTypes").get(authMiddleware, getAllMovieTypes);
router.route("/movieTypes/favorites").get(authMiddleware, getFavoriteMovieTypes);
router.route("/movieTypes/wishlist").get(authMiddleware, getWishListMovieTypes);
router.route("/movieTypes/watched").get(authMiddleware, getWatchedMovieTypes);
router.route("/movieType/user-by-type").get(authMiddleware, getUserMovieTypesbyUser);
router.route("/movieType/:userId/counts").get(authMiddleware, getUserMovieTypesCounts);

router.route("/movieType/:id").get(authMiddleware, getMovieTypeById);
router.route("/movieType/create").post(authMiddleware, createandUpdateMovieType);
router.route("/movieType/delete/:id").delete(authMiddleware, deleteMovieType);
router.route("/movieType/create/isOnProfile").put(authMiddleware, isOnProfileMovieType);



export default router;
