import express from 'express';
import { getAllMovieCategories, getMovieCategoryById, createMovieCategory, updateMovieCategory, deleteMovieCategory } from '../controllers/movieCategoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/movie-categories').get(authMiddleware, getAllMovieCategories);
router.route('/movie-category/:id').get(authMiddleware, getMovieCategoryById);
router.route('/movie-category/create').post(authMiddleware, createMovieCategory);
router.route('/movie-category/update/:id').put(authMiddleware, updateMovieCategory);
router.route('/movie-category/delete/:id').delete(authMiddleware, deleteMovieCategory);

export default router;