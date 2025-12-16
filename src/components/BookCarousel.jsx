import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookCarousel({ title, query }) {
  const [books, setBooks] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=10`
      );
      const data = await res.json();

      if (data.items) {
        setBooks(
          data.items.map((b) => ({
            id: b.id,
            title: b.volumeInfo.title,
            cover:
              b.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/150",
            price: Math.floor(Math.random() * 300000) + 50000,
          }))
        );
      }
    };

    fetchBooks();
  }, [query]);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={() => navigate(`/category/${query}`)}
          className="text-[#b74e3a] hover:underline"
        >
          Xem thêm →
        </button>
      </div>

      {/* Carousel */}
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full px-3 py-2"
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-8"
        >
          {books.map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/book/${b.id}`)}
              className="flex flex-col min-w-50 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer"
            >
              <img
                src={b.cover}
                alt={b.title}
                className="w-full h-60 object-cover rounded-t-lg"
              />
              <div className="p-3 flex flex-col flex-1">
                <p className="font-medium line-clamp-2">{b.title}</p>
                <p className="text-[#b74e3a] font-bold mt-auto">
                  {b.price.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full px-3 py-2"
        >
          ›
        </button>
      </div>
    </div>
  );
}
