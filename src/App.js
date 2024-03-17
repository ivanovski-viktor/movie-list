import { useEffect, useState } from "react";
import Loader from "./Components/Loader";
import WatchedSummary from "./Components/WatchedSummary";
import WatchedMovieList from "./Components/WatchedMovieList";
import MovieDetails from "./Components/MovieDetails";
import MovieList from "./Components/MovieList";
import Box from "./Components/Box";
import NavBar from "./Components/NavBar";
import Search from "./Components/Search";
import NumResults from "./Components/NumResults";
import Main from "./Components/Main";

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
              key={key}
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
