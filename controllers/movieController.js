import Movie from "../models/movie.js";
//This section probably get updated after making ai.

export const getAllMovies = async (req, res) => {
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
        const movie=await Movie.findByPk(id);
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
    const movie = await movie.update(req.body, {
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
