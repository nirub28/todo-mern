import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/search.module.css";
import { useSelector } from "react-redux";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const currentUser = useSelector((state) => state.user.user);

  async function handleSearch(e) {
    try {
      const response = await fetch(
        `http://localhost:8000/user/search?query=${query}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search by name or username"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch();
        }}
        className={styles.searchInput}
      />

      <ul className={styles.resultsList}>
      {Array.isArray(results) &&
  results.map((result) => (
    <li key={result._id} className={styles.resultItem}>
      {currentUser.id === result._id ? (
        <Link to="/profile">
          <img
            src={
              result.profilePicture ||
              "https://img.icons8.com/fluency/48/test-account.png"
            }
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.divName}>
            {result.username}
            <span>{result.name}</span>
          </div>
        </Link>
      ) : (
        <Link to={`/user/profile/${result._id}`}>
          <img
            src={
              result.profilePicture ||
              "https://img.icons8.com/fluency/48/test-account.png"
            }
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.divName}>
            {result.username}
            <span>{result.name}</span>
          </div>
        </Link>
      )}
    </li>
  ))}

      </ul>
    </div>
  );
}

export default SearchComponent;
