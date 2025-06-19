import Movie from "../models/movie.js";
import { getMovieWithPlatforms } from "../utils/fetchMovie.js";
import axios from 'axios';
import InitState from "../models/initState.js";
import MovieCategory from "../models/movieCategory.js";
import config from '../configs/globalConfig.js';

const api_key = config.MOVIE_API_KEY;

export const getAllMoviesForDb = async (req, res) => {
    const allMovies = [];
    const latinOnlyRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü0-9\s.,;:'"!?()\-]+$/;

    try {
      for (let page = 1; page <= 10; page++) {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          headers: { Authorization: `Bearer ${api_key}`},
          params: { language: 'tr-TR', page }
        });
  
        const movies = response.data.results;
  
        for (const movie of movies) {
          const existingMovie = await Movie.findOne({ where: { external_id: movie.id } });
          if(existingMovie){
            // console.log(existingMovie);
            console.log("Existing movies coming")
          }
          else if(movie.title===null || movie.title===undefined || movie.title==="" || !latinOnlyRegex.test(movie.title)){
            continue;

          }
          else{
          const result = await getMovieWithPlatforms(movie.id);
          if (!result) continue;
  
          const savedMovie = await Movie.create(result.movieData);
  
          for (const catId of result.movieCategories) {
            await MovieCategory.findOrCreate({
              where: {
                movie_id: savedMovie.id,
                category_id: catId
              }
            });
          }
  
          allMovies.push(savedMovie);}
        }
  
      }
  
      await InitState.update(
        { initialized: true },        
        { where: { id: 1 } }          
);
        
      res.status(200).json({
        message: req.shouldUpdate
          ? `DB updated. ${allMovies.length} movie executed.`
          : `DB initialized. ${allMovies.length} movie added.`
      });
  
    } catch (error) {
      console.error(' Cannot save movies:', error.message,error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
};

