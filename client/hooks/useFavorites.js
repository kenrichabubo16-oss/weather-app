import { useCallback, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = useCallback((email) => {
    const raw = localStorage.getItem(`favorites_${email}`);
    if (!raw) return setFavorites([]);

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") {
        setFavorites([]);
        return;
      }
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const saveFavorites = (email, favs) => {
    localStorage.setItem(`favorites_${email}`, JSON.stringify(favs));
  };

  const isFavorite = (favoritesList, loc) => {
    const key = `${loc.lat},${loc.lon}`;
    return favoritesList.some((f) => `${f.lat},${f.lon}` === key);
  };

  const toggleFavorite = ({ currentUser, loc }) => {
    if (!currentUser) return;

    const key = `${loc.lat},${loc.lon}`;
    const exists = favorites.some((f) => `${f.lat},${f.lon}` === key);

    const newFavs = exists
      ? favorites.filter((f) => `${f.lat},${f.lon}` !== key)
      : [...favorites, loc];

    setFavorites(newFavs);
    saveFavorites(currentUser.email, newFavs);
  };

  const clearFavorites = () => setFavorites([]);

  return { favorites, loadFavorites, toggleFavorite, clearFavorites, isFavorite };
}
