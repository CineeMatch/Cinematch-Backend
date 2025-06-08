import MovieType from "../models/movieType.js";
import User from "../models/user.js";
import Movie from "../models/movie.js";
import { normalizeMovieFlags } from "../utils/movieTypeRules.js";


export const getAllMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll();
    res.status(200).json(movieTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie types" });
  }
}

export const getFavoriteMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { favoriteMovies: true } });
    res.status(200).json(movieTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorite movie types" });
  }
}

export const getWishListMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { wishlistMovies: true } });
    res.status(200).json(movieTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wish list movie types" });
  }
}

export const getWatchedMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { watchedMovies: true } });
    res.status(200).json(movieTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching watched movie types" });
  }
}

export const getMovieTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const movieType = await MovieType.findByPk(id);
    if (movieType) {
      res.status(200).json(movieType);
    } else {
      res.status(404).json({ message: "Movie type not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie type" });
  }
}


export const createandUpdateMovieType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movie_id, favoriteMovies, watchedMovies, wishlistMovies } = req.body;

    if (!movie_id) {
      return res.status(400).json({ error: "movie_id is required." });
    }

    if (![favoriteMovies, watchedMovies, wishlistMovies].some(Boolean)) {
      return res.status(400).json({ error: "At least one list type must be true." });
    }

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const existingMovie = await Movie.findByPk(movie_id);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    const normalized = normalizeMovieFlags({ favoriteMovies, watchedMovies, wishlistMovies });

    const existingRecord = await MovieType.findOne({
      where: { user_id: userId, movie_id }
    });

    if (existingRecord) {
      Object.assign(existingRecord, normalized);
      await existingRecord.save();
      return res.status(200).json(existingRecord);
    }

    const movieType = await MovieType.create({
      user_id: userId,
      movie_id,
      ...normalized,
      added_at: new Date(),
    });

    return res.status(201).json(movieType);

  } catch (error) {
    console.error("Create MovieType Error:", error);
    return res.status(500).json({ error: `Failed to create movie type, ${error.message}` });
  }
};


export const deleteMovieType = async (req, res) => {
  const { id } = req.params;
  try {
    const existingMovieType = await MovieType.findByPk(id);
    if (!existingMovieType) {
      return res.status(404).json({ message: "Movie type not found" });
    }
    await existingMovieType.destroy();
    return res.status(200).json({ message: "Movie type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie type" });
  }
}

