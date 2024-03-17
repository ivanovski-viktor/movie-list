import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "c1e8a42d";

export default function AppCopy() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    const watchedMovie = watched.some(
      (movie) => String(movie.imdbID) === String(selectedId)
    );
    setIsWatched(watchedMovie);
  }, [selectedId]);

  function handleDeleteMovie(movie) {
    const updatedWatched = watched.filter(
      (watchedMovie) => movie.imdbID !== watchedMovie.imdbID
    );
    setWatched(updatedWatched);
  }
  function handleSelectMovie(movieId) {
    setSelectedId((cs) => (cs === movieId ? null : movieId));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    const movieID = movie.imdbID;
    const filteredArr = watched.filter(
      (arrmovie) => arrmovie.imdbID === movieID
    );
    if (filteredArr.length > 0) {
      setSelectedId(null);
      return;
    } else {
      setWatched((cs) => [...cs, movie]);
      setSelectedId(null);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    async function fetchMovies() {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`
        );
        if (!res.ok === true) throw new Error("No response from server!");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setError(""); // Clear error when successful response received
        setMovies(data.Search);
      } catch (err) {
        let cleanError = String(err);
        setError(cleanError.substring(7, err.length));
        setMovies([]); // Clear movies when error occurs
      } finally {
        setIsLoading(false);
      }
    }
    if (query === "") {
      setMovies([]); // Clear movies when query is empty
      setIsLoading(false);
      setError("");
    } else {
      fetchMovies();
    }
  }, [query]);

  //[] this indicates fetching data on mount(first render of app)
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {movies && !isLoading && (
            <MovieList handleSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && !isLoading && <p className="error">💀{error}</p>}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              isWatched={isWatched}
              handleAddWatched={handleAddWatched}
              handleCloseMovie={handleCloseMovie}
              selectedId={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                handleDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
        {/* <WatchedBox /> */}
      </Main>
    </>
  );
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Search({ query, setQuery }) {
  function handleSetQuery(e) {
    setQuery(e.target.value);
  }
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => handleSetQuery(e)}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          handleSelectMovie={handleSelectMovie}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, handleSelectMovie }) {
  return (
    <li onClick={(e) => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMovieList({ watched, handleDeleteMovie }) {
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

function MovieDetails({
  selectedId,
  handleCloseMovie,
  movies,
  handleAddWatched,
  isWatched,
}) {
  // let selectedMovieById = movies.find((movie) => movie.imdbID === selectedId);
  //solution for no other api calls
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [watchedRating, setWatchedRating] = useState(5);

  function handleAddRating(rating) {
    setWatchedRating(rating);
  }
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  function onAddWatched() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      rating: watchedRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };

    handleAddWatched(newMovie);
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            {isWatched ? (
              <div className="rating">You have rated this movie!</div>
            ) : (
              <div className="rating">
                <StarRating
                  handleAddRating={handleAddRating}
                  maxRating={10}
                  size={15}
                />
                <button className="btn-add" onClick={onAddWatched}>
                  Add To List
                </button>
              </div>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.rating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function Loader() {
  return <p className="loader"> Loading...</p>;
}
