import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Filter from "./components/Filter.jsx";
import Header from "./components/Header.jsx";
import Booklist from "./components/Booklist.jsx";
import Pagination from "./components/Pagination.jsx";
import BookDetail from "./components/Bookdetail.jsx";
function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function App() {
  const [view, setView] = useState("grid"); // 'grid' | 'list'
  const [query, setQuery] = useState("fiction");
  const [genre, setGenre] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 0 = first page
  const [totalItems, setTotalItems] = useState(0);
  const RESULTS_PER_PAGE = 20;
  const genres = useMemo(() => ["all", ...new Set(books.map((b) => b.genre))], [books]);
  useEffect(() => {
  if (!query) return;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${page * RESULTS_PER_PAGE}&maxResults=${RESULTS_PER_PAGE}`
        );
        const data = await res.json();
        if (data.items) {
          // Normalize Google Books data into our own structure
          setTotalItems(data.totalItems || 0);
          const mapped = data.items.map((b) => ({
            id: b.id,
            title: b.volumeInfo.title,
            author: (b.volumeInfo.authors && b.volumeInfo.authors[0]) || "Unknown",
            genre: (b.volumeInfo.categories && b.volumeInfo.categories[0]) || "General",
            price: Math.floor(Math.random() * 300000) + 50000, // fake price
            rating: (b.volumeInfo.averageRating || (Math.random() * 5).toFixed(1)),
            cover: b.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
            description: b.volumeInfo.description || "No description available.",
          }));
          setBooks(mapped);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [query, page]);

  // Filter by genre
  const filtered = useMemo(() => {
    if (genre === "all") return books;
    return books.filter((b) => b.genre === genre);
  }, [books, genre]);

  return (
    <div className="min-h-screen flex justify-center bg-[#f7f3f1] text-[#2b1f1a] p-6">
      <div className="max-w-7xl mx-auto w-full">
        <Header query={query} setQuery={setQuery} view={view} setView={setView} genres={genres} genre={genre} setGenre={setGenre}/>
        <main className="flex justify-center">
          <section className="w-full max-w-5xl">
            <Routes>
              <Route
                path="/"
                element={
                  loading ? (
                    <p className="text-center text-[#6b4f45]">Loading books...</p>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : (
                    <>
                      <Booklist
                        view={view}
                        filtered={filtered}
                        setSelected={setSelected}
                        currency={currency}
                      />
                      <Pagination
                        page={page + 1}
                        totalPages={Math.min(30, Math.ceil(totalItems / RESULTS_PER_PAGE))}
                        onPageChange={(newPage) => setPage(newPage - 1)}
                      />
                    </>
                  )
                }
              />
              <Route path="/book/:id" element={<BookDetail />} />
            </Routes>
          </section>
        </main>
      </div>
    </div>
  );
}
