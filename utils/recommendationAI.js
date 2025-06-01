import MovieType from "../models/movieType.js";

export const getUserMovies = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const movies = await MovieType.findAll({
      where: { user_id: userId },
      attributes: ["movie_id", "favoriteMovies", "watchedMovies"],
    });
    //http://localhost:3000/api/user/1/movies gibi bir endpoint döndürecek
    res.status(200).json({
      userId,
      movies
    });
  } catch (error) {
    console.error("Kullanıcı film verisi alınırken hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};