import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useToast } from "./ToastContext";
const FavContext = createContext();

export function FavProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  /* ---------- helpers ---------- */
  const {showToast} = useToast(); //show pop up
  const isFavorite = (id) => favorites.some((b) => b.id === id);

  const addFavorite = (book) => {
    setFavorites((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleFavorite = (book) => {
    if(isFavorite(book.id)){
      showToast("Đã xóa khỏi sản phẩm yêu thích!");
    }
    else{
      showToast("Đã thêm vào sản phẩm yêu thích!");
    }
    setFavorites((prev) =>
      prev.some((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book]
    );
  };

  return (
    <FavContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </FavContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavContext);
}
