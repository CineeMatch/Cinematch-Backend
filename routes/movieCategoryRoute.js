import express from 'express';
import { getAllMovieCategories, getMovieCategoryById, createMovieCategory, updateMovieCategory, deleteMovieCategory } from '../controllers/movieCategoryController.js';

const router = express.Router();

router.route('/movie-categories').get(getAllMovieCategories);
router.route('/movie-category/:id').get(getMovieCategoryById);
router.route('/movie-category/create').post(createMovieCategory);
router.route('/movie-category/update/:id').put(updateMovieCategory);
router.route('/movie-category/delete/:id').delete(deleteMovieCategory);

export default router;