import axios from 'axios';
import { getMovieWithPlatforms } from './fetchMovie.js';
import config from '../configs/config.cjs';

const { api_key } = config;


export default async function searchMovieByName(movieName) {

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        headers: { Authorization: `Bearer ${api_key}`,
          accept: 'application/json'
 },

      params: {
        query: movieName,
        language: 'tr-TR'
      }
    });
    const searchedMovies = response.data.results;
    const searchedMoviesWithDetails = await Promise.all(searchedMovies.map(async movie => ({
      ... await getMovieWithPlatforms(movie.id)
    })));

    console.log(searchedMoviesWithDetails);
    return {searchedMovieList:searchedMoviesWithDetails};
  } catch (error) {
    console.error('Arama hatası:', error.message);
  }
};

