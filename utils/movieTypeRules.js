export function normalizeMovieFlags({ favoriteMovies, watchedMovies, wishlistMovies }) {
  const favorite = !!favoriteMovies;
  const watched = !!watchedMovies;
  const wishlist = !(favorite || watched) && !!wishlistMovies;

  return {
    favoriteMovies: favorite,
    watchedMovies: watched,
    wishlistMovies: wishlist,
  };
}