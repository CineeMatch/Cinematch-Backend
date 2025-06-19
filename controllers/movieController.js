import Movie from "../models/movie.js";
import Platform from "../models/platform.js";
import { Op } from "sequelize";
import MovieCategory from "../models/movieCategory.js";
import { getMovieWithPlatforms,searchMovieByName } from "../utils/movieApi.js";
import axios from 'axios';
import globalConfig from "../configs/globalConfig.js";
import sequelize from "../configs/database.js";
import Category from "../models/category.js";
import MoviePlatform from "../models/moviePlatform.js";
import {recommendMoviesForUser} from "../utils/recommendationAlgorithm.js"
const  api_key  = globalConfig.MOVIE_API_KEY;

export const getAllMovies = async (req,res) => {
  try {
    const movies = await Movie.findAll({ include: [{
    model: Category,
    as: 'categories',
    attributes: ['id','name'],
    through: { attributes: [] },
  },{
    model: Platform,
    as: 'platforms',
    attributes: ['id','name'],
    through: { attributes: [] },
  }] });
    return res.status(200).json(movies);
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Movies cannot be found.' });
  }
};
export const getMovie=async(req,res)=>{
    try {
        const movie=await Movie.findByPk(req.params.id,{ include: [{
    model: Category,
    as: 'categories',
    attributes: ['id','name'],
    through: { attributes: [] },
  },{
    model: Platform,
    as: 'platforms',
    attributes: ['id','name'],
    through: { attributes: [] },
  }] });
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
  const movie=await Movie.findOne({where:{external_id:req.body.external_id}});
  if(movie){
   return res.status(409).json("This movie already exist.");
  }
  const newMovie=await Movie.create(req.body);
  return res.status(201).json({message:"Movie created successfully.",movie:newMovie});
 } catch (error) {
  console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Movie cannot be created.' });
 }
};

export const deleteMovie = async (req, res) => {
  try {
     await MovieCategory.destroy({
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
    // 1️⃣ Veritabanında ara
    const dbMovies = await Movie.findAll({
      where: {
        title: { [Op.like]: `%${movieTitle}%` }
      },
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: Platform,
          as: 'platforms',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    if (dbMovies.length >= 20) {
      return res.status(200).json(dbMovies.slice(0, 20));
    }

    // 2️⃣ TMDb'den ara
    const result = await searchMovieByName(movieTitle);
    const { searchedMovieList } = result || {};
    console.log("result",result);

    if (!searchedMovieList || searchedMovieList.length === 0) {
      return res.status(404).json({ message: "TMDb'de de film bulunamadı." });
    }

    // 3️⃣ Filtreleme
    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    const filteredNewMovies = [];

    for (const movie of searchedMovieList) {
      if (filteredNewMovies.length + dbMovies.length >= 20) break;

      const data = movie.movieData;
      const title = data?.title;
      const releaseDateStr = data?.release_year;
      const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;
      const poster_url = data?.poster_url;

      const valid =
        title &&
        poster_url &&
        latinOnlyRegex.test(title) &&
        releaseDate &&
        releaseDate.getFullYear() >= 1900 &&
        releaseDate <= oneYearLater &&
        data?.external_id;

      if (!valid) continue;

      try {
        // 🧠 FIND OR CREATE!
        const [createdMovie, isNew] = await Movie.findOrCreate({
          where: { external_id: data.external_id },
          defaults: data
        });


        if (isNew) {
         for (const catID of movie.movieCategories) {
            await MovieCategory.findOrCreate({
              where: {
                movie_id: createdMovie.id,
                category_id: catID
              }
            });}
            for(const platformId of movie.moviePlatforms){
            await MoviePlatform.findOrCreate({
              where: {
                movie_id: createdMovie.id,
                platform_id: platformId
              }
            });
            }
          filteredNewMovies.push(createdMovie);
        }
      } catch (err) {
        console.error(`Hata oluştu: ${data?.title}`, err.message);
      }
    }

    const finalList = [...dbMovies, ...filteredNewMovies].slice(0, 20);

    if (finalList.length === 0) {
      return res.status(404).json({ message: "Hiçbir film kriterleri geçemedi." });
    }

    return res.status(200).json(finalList);
  } catch (err) {
    console.error('searchMovie error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
};


export const getTop10Movies = async (req, res) => {
  const allMovies = [];
  const latinOnlyRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü0-9\s.,;:'"!?&*()\-]+$/;

  try {
    console.log("Api key deki veri ", api_key);
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

      const existingMovie = await Movie.findOne({ where: { external_id: movie.id }, include: [{
    model: Category,
    as: 'categories',
    attributes: ['id','name'],
    through: { attributes: [] },
  },{
    model: Platform,
    as: 'platforms',
    attributes: ['id','name'],
    through: { attributes: [] },
  }] });
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
    res.status(500).json({ error: `Movies cannot be fetched. ${error.message}` });
  }
};
export const getRandomMovie = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      where: {
        background_url: {
          [Op.ne]: null
        }
      },
      order: sequelize.literal('RAND()'),
      limit: req.body.limit,
      include: [{
        model: Category,
        as: 'categories',
        attributes: ['id','name'],
        through: { attributes: [] },
      },{
        model: Platform,
        as: 'platforms',
        attributes: ['id','name'],
        through: { attributes: [] },
      }]
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found." });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching random movies:', error);
    res.status(500).json({ error: 'Random movies cannot be fetched.' });
  }
}
export const getMovieRecommendations=async (req,res)=>{
  try {
    const userId=req.user.id;
    const recommendatedMovies= await recommendMoviesForUser(userId);
    res.status(200).json({message:"recommendated movies created",movies:recommendatedMovies});
  } catch (error) {
 console.error("Recommendation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
    
  }
}