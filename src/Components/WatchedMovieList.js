export default function WatchedMovieList({ watched, handleDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedListItem
          handleDeleteMovie={handleDeleteMovie}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function WatchedListItem({ movie, handleDeleteMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.rating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime || "unknown"} min</span>
        </p>
        <button onClick={() => handleDeleteMovie(movie)} className="btn-delete">
          X
        </button>
      </div>
    </li>
  );
}
