import React, { useState, useEffect, useMemo} from "react";
import { useParams, useLocation } from "react-router-dom";
import Booklist from "../components/Booklist";
import Pagination from "../components/Pagination";

function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function Category() {
  const { slug } = useParams(); // /category/:slug
  const location = useLocation(); // /category?query=...
  const searchParams = new URLSearchParams(location.search);
  const queryFromSearch = searchParams.get("query");
  const searchTerm = queryFromSearch || slug; // Decide what to search for

  const [view, setView] = useState("grid");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const RESULTS_PER_PAGE = 20;
  // Reset page when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            searchTerm
          )}&startIndex=${page * RESULTS_PER_PAGE}&maxResults=${RESULTS_PER_PAGE}`
        );

        const data = await res.json();

        if (data.items) {
          setTotalItems(data.totalItems || 0);
          setBooks(
            data.items.map((b) => ({
              id: b.id,
              title: b.volumeInfo.title,
              publisher: b.volumeInfo.publisher || "Unknown",
              author: b.volumeInfo.authors?.[0] || "Unknown",
              genre: b.volumeInfo.categories?.[0] || "General",
              price: Math.floor(Math.random() * 300000) + 50000,
              rating: b.volumeInfo.averageRating || 0,
              cover: b.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
              description: b.volumeInfo.description || "No description available.",
            }))
          );
        } else {
          setBooks([]);
        }
      } catch {
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm, page]);
  //Filter
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [publisher, setPublisher] = useState([]);
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // PRICE FILTER
    if (priceRange !== "all") {
      if (priceRange === "low") {
        result = result.filter(b => b.price < 100000);
      }
      if (priceRange === "mid") {
        result = result.filter(b => b.price >= 100000 && b.price <= 200000);
      }
      if (priceRange === "high") {
        result = result.filter(b => b.price > 200000);
      }
    }

    // PUBLISHER FILTER
    if (publisher.length > 0) {
      result = result.filter(b =>
        publisher.includes(b.publisher)
      );
    }


    // SORT
    if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === "za") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [books, priceRange, sort, publisher]);
  const publishers = useMemo(() => {
    return Array.from(
      new Set(books.map(b => b.publisher).filter(Boolean))
    );
  }, [books]);
  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  return (
    <>
      {/* SEARCH RESULT HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Kết quả tìm kiếm:{" "}
          <span className="text-[#b74e3a]">
            {searchTerm}
          </span>{" "}
          ({totalItems} kết quả)
        </h2>
      </div>

      {books.length === 0 ? (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-2xl text-gray-500">
            Không tìm thấy kết quả nào.
          </p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-12 gap-6">
          {/* FILTER SIDEBAR */}
          <aside className="col-span-3 bg-white rounded-lg p-4 mt-15 h-fit">
            <h3 className="font-semibold text-lg mb-4">Bộ lọc</h3>

            {/* PRICE */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Giá</h4>

              {[
                { id: "all", label: "Tất cả" },
                { id: "low", label: "Dưới 100.000 ₫" },
                { id: "mid", label: "100.000 – 200.000 ₫" },
                { id: "high", label: "Trên 200.000 ₫" },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 text-sm mb-1">
                  <input
                    type="checkbox"
                    checked={priceRange === opt.id}
                    onChange={() => setPriceRange(opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {/* PUBLISHER */}
            {publishers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Nhà xuất bản</h4>

                {publishers.map(p => (
                  <label key={p} className="flex items-center gap-2 text-sm mb-1">
                    <input
                      type="checkbox"
                      checked={publisher.includes(p)}
                      onChange={() =>
                        setPublisher(prev => (prev.includes(p) ? (prev.filter(x => x != p)) : [...prev, p]))
                      }
                    />
                    {p}
                  </label>
                ))}
              </div>
            )}

            {/* RESET */}
            <button
              onClick={() => {
                setPriceRange("all");
                setSort("relevance");
                setPublisher([]);
              }}
              className="w-full mt-2 py-2 border rounded text-sm hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </aside>

          {/* BOOKLIST */}
          <div className="col-span-9">
            <Booklist
              view={view}
              setView={setView}
              filtered={filteredBooks}
              currency={currency}
              query={searchTerm}
              sort={sort}
              setSort={setSort}
            />

            <Pagination
              page={page + 1}
              totalPages={Math.min(30, Math.ceil(totalItems / RESULTS_PER_PAGE))}
              onPageChange={(p) => setPage(p - 1)}
            />
          </div>
        </div>

        </>
      )}
    </>
  );
}
