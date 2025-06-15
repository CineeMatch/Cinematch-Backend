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
    const count = movieTypes.length;
    res.status(200).json({count, data: movieTypes});
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorite movie types" });
  }
}

export const getWishListMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { wishlistMovies: true } });
    const count = movieTypes.length;
    res.status(200).json({count, data: movieTypes});

  } catch (error) {
    res.status(500).json({ message: "Error fetching wish list movie types" });
  }
}

export const getWatchedMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { watchedMovies: true } });
    const count = movieTypes.length;
    res.status(200).json({count, data: movieTypes});
    
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

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const existingMovie = await Movie.findByPk(movie_id);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    const normalized = normalizeMovieFlags({ favoriteMovies, watchedMovies, wishlistMovies });

    const allFalse = !normalized.favoriteMovies && !normalized.watchedMovies && !normalized.wishlistMovies;

    const existingRecord = await MovieType.findOne({
      where: { user_id: userId, movie_id }
    });

    if (existingRecord) {
      if (allFalse) {
        await existingRecord.destroy();
        return res.status(200).json({ message: "MovieType entry deleted because all flags are false." });
      } else {
        Object.assign(existingRecord, normalized);
        await existingRecord.save();
        return res.status(200).json(existingRecord);
      }
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

export const isOnProfileMovieType = async (req, res) => {
  const userId = req.user.id;
  const { movie_ids } = req.body;

  if (!Array.isArray(movie_ids) || movie_ids.length === 0) {
    return res.status(400).json({ message: "No movie IDs provided." });
  }

  try {

      const previouslyOnProfile = await MovieType.findAll({
      where: { user_id: userId, is_on_profile: true }
    });

     for (const movieType of previouslyOnProfile) {
      if (!movieType.favorite && !movieType.wishlist && !movieType.watched) {
        await movieType.destroy();
        console.log(`Deleted movieType with movie_id: ${movieType.movie_id}`);
      } else {
        movieType.is_on_profile = false;
        await movieType.save();
      }
    }

    const updatedMovies = [];

    const limitedMovieIds = movie_ids.slice(0, 5);

    for (const movie_id of limitedMovieIds) {
      let movieType = await MovieType.findOne({
        where: { user_id: userId, movie_id }
      });

      if (movieType) {
        movieType.is_on_profile = true;
        await movieType.save();
      } else {
        movieType = await MovieType.create({
          user_id: userId,
          movie_id,
          is_on_profile: true
        });
      }

      updatedMovies.push(movieType);
    }

    return res.status(200).json({
      isOnProfile: true,
      message: `${updatedMovies.length} movies added to profile`,
      movieTypes: updatedMovies
    });

  } catch (error) {
    console.error("Error updating profile movies:", error);
    return res.status(500).json({
      error: `Failed to update profile movies - ${error.message}`
    });
  }
};

export const getUserMovieTypesbyUser = async (req, res) => {
  // queryden alındığı için routeda http://localhost:3000/api/movieTypes?type=favorite gibi bir istek yapılmalı
  try {
    const userId = req.user.id;
    const type = req.query.type; // Örn: 'favorite', 'wishlist', 'watched'

    if (!["favorite", "wishlist", "watched"].includes(type)) {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    let whereCondition = {};

    if (type === "favorite") {
      whereCondition.favoriteMovies = true;
    } else if (type === "wishlist") {
      whereCondition.wishlistMovies = true;
    } else if (type === "watched") {
      whereCondition.watchedMovies = true;
    }

    const movieTypes = await MovieType.findAll({
      where: {
        ...whereCondition,
        user_id: userId, 
      },
    });

    const count = movieTypes.length;
    res.status(200).json({ count, data: movieTypes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message:  `Error fetching user movie types - ${error.message}` });
  }
};

export const getUserMovieTypesCounts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is requeid" });
    }

    const [favoriteCount, wishlistCount, watchedCount] = await Promise.all([
      MovieType.count({ where: { user_id: userId, favoriteMovies: true } }),
      MovieType.count({ where: { user_id: userId, wishlistMovies: true } }),
      MovieType.count({ where: { user_id: userId, watchedMovies: true } }),
    ]);

    res.status(200).json({
      userId,
      favoriteCount,
      wishlistCount,
      watchedCount,
      favoriteList,
      wishlistList,
      watchedList,
    });

  } catch (error) {
    res.status(500).json({ message:  `Error fetching user movie list counts - ${error.message}` });
  }
};
