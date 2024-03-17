export default function Search({ query, setQuery }) {
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
