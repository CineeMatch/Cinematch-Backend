import MovieType from "../models/movieType.js";

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
    const movieTypes = await MovieType.findAll({ where: { is_favorite: true } });
    res.status(200).json(movieTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorite movie types" });
  }
}

export const getWishListMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { is_wish_list: true } });
    res.status(200).json(movieTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wish list movie types" });
  }
}

export const getWatchedMovieTypes = async (req, res) => {
  try {
    const movieTypes = await MovieType.findAll({ where: { is_watched: true } });
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


export const createMovieType = async (req, res) => {
  try {
    const { user_id, movie_id, listType } = req.body;

    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const existingMovie = await Movie.findByPk(movie_id);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    if (!["favorite", "watched", "wishlist"].includes(listType)) {
      return res.status(400).json({ error: "Invalid list type." });
    }

    // Aynı kullanıcı ve film kombinasyonu zaten var mı kontrol et
    const existingRecord = await MovieType.findOne({ where: { user_id, movie_id } });
    if (existingRecord) {
      return res.status(400).json({ error: "Movie type already exists for this user and movie." });
    }

    const newRecord = {
      user_id,
      movie_id,
      favoriteMovies: listType === "favorite",
      watchedMovies: listType === "watched",
      wishlistMovies: listType === "wishlist",
      added_at: new Date(),
      is_on_profile: true,
    };

    const movieType = await MovieType.create(newRecord);

    return res.status(201).json(movieType);
  } catch (error) {
    console.error("Create MovieType Error:", error);
    res.status(500).json({ error: "Failed to create movie type." });
  }
};

export const updateMovieType = async (req, res) => {
  try {
    const { user_id, movie_id, listType } = req.body;

    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const existingMovie = await Movie.findByPk(movie_id);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found." });
    }


    if (!["favorite", "watched", "wishlist"].includes(listType)) {
      return res.status(400).json({ error: "Invalid list type." });
    }

    const movieType = await MovieType.findOne({ where: { user_id, movie_id } });

    if (!movieType) {
      return res.status(404).json({ error: "Movie type not found for this user and movie." });
    }

    if (listType === "favorite") {
      movieType.favoriteMovies = true;
    } else if (listType === "watched") {
      movieType.watchedMovies = true;
    } else if (listType === "wishlist") {
      movieType.wishlistMovies = true;
    }

    await movieType.save();

    return res.status(200).json(movieType);
  } catch (error) {
    console.error("Update MovieType Error:", error);
    res.status(500).json({ error: "Failed to update movie type." });
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
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie type" });
  }
}