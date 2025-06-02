import Movie from "../models/movie.js";
import movieCategory from "../models/movieCategory.js";
import { Op } from "sequelize";
import MovieCategory from "../models/movieCategory.js";
import { getMovieWithPlatforms,searchMovieByName } from "../utils/movieApi.js";
import axios from 'axios';
import config from '../configs/config.cjs';
const { api_key } = config;

export const getAllMovies = async (req,res) => {
  try {
    const movies = await Movie.findAll();
    return res.status(200).json(movies);
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Movies cannot be found.' });
  }
};
export const getMovie=async(req,res)=>{
    try {
        const movie=await Movie.findByPk(req.params.id);
        if(!movie){
            return res.status(404).json({ error: `Movie doesn't exist.` });
        }
        return res.status(200).json(movie);
    } catch (error) {
        console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Movie cannot be found.' });
    }
}

export const  createMovie= async (req, res) => {
 try {
  const movie=await movie.findOne({where:{external_id:req.body.external_id}});
  if(movie){
    res.status(409).json("This movie already exist.");
  }
  const newMovie=await movie.create(req.body);
  res.status(201).json({message:"Movie created successfully.",movie:newMovie});
 } catch (error) {
  console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Movie cannot be created.' });
 }
};

export const deleteMovie = async (req, res) => {
  try {
     await movieCategory.destroy({
      where: { movie_id: req.params.id }
    });
    const movie=await Movie.destroy({
      where: { id: req.params.id }
    });
   

    if (movie) {
      return res.status(200).json({ message: "Movie deleted successfully." });
    } else {
      return res.status(404).json({ message: "This movie doesn't exist." });
    }
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ error: 'Movie could not be deleted.' });
  }
};

export const updateMovie = async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await Movie.update(req.body, {
      where: { id: movieId }
    });
    if (movie[0] === 0) {
      return res.status(404).json({ message: "Movie not found or not updated." });
    }
    res.status(200).json({message:"Movie is updated.",movie:movie});
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "Movie could not be updated." });
  }
};


export const searchMovie = async (req, res) => {
  const movieTitle = req.body.title;
const latinOnlyRegex = /^[A-Za-zÇĞİÖŞÜçğıöşüÑñÁáÉéÍíÓóÚúÜüâêîôûãõß0-9\s.,;:'"!?()\-*&]+$/;

  if (!movieTitle || movieTitle.trim() === '') {
    return res.status(400).json({ message: "Film adı boş olamaz." });
  }

  try {
    const movies = await Movie.findAll({
      where: {
        title: {
          [Op.like]: `%${movieTitle}%`
        }
      }
    });

    if (movies.length > 0) {
      return res.status(200).json(movies);
    }

    try {
      const result = await searchMovieByName(movieTitle);
      const { searchedMovieList } = result || {};

      if (!searchedMovieList || searchedMovieList.length === 0) {
        return res.status(404).json({ message: "TMDb'de de film bulunamadı." });
      }

      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      const filteredList = searchedMovieList.filter((movie) => {
        const data = movie.movieData;
        const title = data?.title;
        const releaseDateStr = data?.release_year;
        const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;

        const passed =
          title &&
          latinOnlyRegex.test(title) &&
          releaseDate &&
          releaseDate.getFullYear() >= 1900 &&
          releaseDate <= oneYearLater;

        if (!passed) {
          console.log("Film filtreyi geçemedi:", title, releaseDateStr);
        }

        return passed;
      });

      if (filteredList.length === 0) {
        return res.status(404).json({ message: "Hiçbir film filtreyi geçemedi." });
      }

      const newMoviesAdded = await Promise.all(
        filteredList.map(async (movie) => {
          try {
            const createdMovie = await Movie.create(movie.movieData);
            return createdMovie;
          } catch (err) {
            console.error(`Error while adding movie: ${movie.movieData?.title}`, err.message);
            return null;
          }
        })
      );

      const successfullyAdded = newMoviesAdded.filter(Boolean);
      return res.status(200).json(successfullyAdded);
    } catch (error) {
      console.error('TMDb search error:', error);
      return res.status(500).json({ error: 'Error occurred while searching for movies on TMDb.' });
    }
  } catch (error) {
    console.error('Error while searching db:', error);
    return res.status(500).json({ error: 'Error occurred while searching for movies in the database.' });
  }
};

export const take10Movies = async (req, res) => {//can break into piecess
  const allMovies = [];
  const latinOnlyRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü0-9\s.,;:'"!?&*()\-]+$/;

  try {
    const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
      headers: { Authorization: `Bearer ${api_key}` },
      params: { language: "tr-TR", page: 1 }
    });

    const movies = response?.data?.results || [];

    if (!movies.length) {
      return res.status(404).json({ message: "No movies found from TMDb." });
    }

    for (const movie of movies) {
      const title = movie.title;

      if (typeof title !== "string" || !title.trim() || !latinOnlyRegex.test(title)) {
        console.log("Movie title is not valid:", title);
        continue;
      }

      const existingMovie = await Movie.findOne({ where: { external_id: movie.id } });
      if (existingMovie) {
        allMovies.length < 10 ? allMovies.push(existingMovie) : null;
        continue;
      }

      const result = await getMovieWithPlatforms(movie.id);
      if (!result) {
        console.log("Cannot get details:", movie.id);
        continue;
      }

      const savedMovie = await Movie.create(result.movieData);

      for (const catId of result.movieCategories) {
        await MovieCategory.findOrCreate({
          where: {
            movie_id: savedMovie.id,
            category_id: catId
          }
        });
      }

      allMovies.length <10 ? allMovies.push(savedMovie) : null;
    }
    

    res.status(200).json({
      message: `${allMovies.length} movie listed.`,
      movies: allMovies
    });

  } catch (error) {
    console.error("Error fetching movies:", error.message, error);
    res.status(500).json({ error: "Movies cannot be fetched." });
  }
};
