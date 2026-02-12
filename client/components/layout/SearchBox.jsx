import React from "react";
import { MapPin, Search } from "lucide-react";

export default function SearchBox({
  searchQuery,
  onSearchChange,
  showSearchResults,
  searchResults,
  onSelectResult,
}) {
  return (
    <div className="search-container">
      <Search size={20} />
      <input
        type="text"
        placeholder="Search cities..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {showSearchResults && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <div
              key={result.key}
              className="search-result-item"
              onClick={() => onSelectResult(result)}
            >
              <div>
                <div className="result-city">{result.name}</div>
                <div className="result-country">
                  {result.state ? `${result.state}, ` : ""}
                  {result.country}
                </div>
              </div>
              <div className="result-temp">
                {result.temp !== null ? `${result.temp}°` : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
