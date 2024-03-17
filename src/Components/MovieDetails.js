import { useState, useEffect } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
const key = "c1e8a42d";

export default function MovieDetails({
  selectedId,
  handleCloseMovie,
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
              ←
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
