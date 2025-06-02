import Category from '../models/category.js';
import axios from 'axios';
import config from '../configs/config.cjs';
const { api_key } = config;


const api_url = "https://api.themoviedb.org/3/movie";

export const getMovieWithPlatforms = async (movieId) => {
  try {
    const [movieDetails, ratingDetails, credits] = await Promise.all([
      axios.get(`${api_url}/${movieId}`, {
        headers: { Authorization: `Bearer ${api_key}` },
        params: {
          language: 'tr-TR',
          append_to_response: 'watch/providers',
        }
      }),
      axios.get(`${api_url}/${movieId}/release_dates`, {
        headers: { Authorization: `Bearer ${api_key}` },
      }),
      axios.get(`${api_url}/${movieId}/credits`, {
        headers: { Authorization: `Bearer ${api_key}` },
      })
    ]);

    const data = movieDetails.data;

    const ageRating = ratingDetails.data.results
      .find(m => m.iso_3166_1 === "TR")
      ?.release_dates?.find(r => r.certification)?.certification || null;

    const cast = credits.data.cast?.slice(0, 5).map(a => a.name).join(", ") || null;
    const director = credits.data.crew?.find(c => c.job === 'Director')?.name || null;

    const providers = data['watch/providers']?.results?.TR?.flatrate || [];
    const platforms = providers.map(p => p.provider_name);
    console.log(platforms);

    const genres = data.genres.map(g => g.name);
    const genreIds = [];

    for (const genreName of genres) {
      let category = await Category.findOne({ where: { name: genreName } });
      if (!category) {
        category = await Category.create({ name: genreName });
        console.log(`New category added: ${genreName}`);
      }
      genreIds.push(category.id);
    }

    return {
      movieData: {
        title: data.title,
        description: data.overview,
        release_year: data.release_date?.split('-')[0] || null,
        duration: data.runtime,
        age_rating: ageRating,
        poster_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        background_url: data.backdrop_path ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` : null,
        watch_link: data['watch/providers']?.results?.TR?.link || null,
        director,
        actor: cast,
        external_id: data.id
      },
      movieCategories: genreIds
    };

  } catch (error) {
    console.error(`Movie detail error (id: ${movieId}):`, error.message);
    return null;
  }
};


export const searchMovieByName = async (movieName) => {

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

