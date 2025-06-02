import Movie from "../models/movie.js";
import movieCategory from "../models/movieCategory.js";
import { Op } from "sequelize";
import searchMovieByName from "../utils/searchMovie.js"; // Import the search function
//This section probably get updated after making ai.

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
  const latinOnlyRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü0-9\s.,;:'"!?()\-]+$/;

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
            console.error(`Film eklenirken hata: ${movie.movieData?.title}`, err.message);
            return null;
          }
        })
      );

      const successfullyAdded = newMoviesAdded.filter(Boolean);
      return res.status(200).json(successfullyAdded);
    } catch (error) {
      console.error('TMDb arama hatası:', error);
      return res.status(500).json({ error: 'TMDb üzerinden film aranırken hata oluştu.' });
    }
  } catch (error) {
    console.error('Veritabanı arama hatası:', error);
    return res.status(500).json({ error: 'Veritabanında film aranırken hata oluştu.' });
  }
};