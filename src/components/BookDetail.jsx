import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
      const data = await res.json();
      setBook(data.volumeInfo);
      setMainImage(data.volumeInfo.imageLinks?.thumbnail);
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center">Loading book details...</p>;
  if (!book) return <p className="text-center">Book not found.</p>;
  const price = (Math.floor(Math.random() * 300000) + 50000).toLocaleString("vi-VN") + " ₫";
  return (
    <div className="grid grid-cols-12 gap-8 mt-8">
      {/* Left panel */}
      <div className="col-span-4 flex flex-col items-center">
        <img
          src={mainImage || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-64 h-auto rounded-lg shadow-md object-contain bg-white p-4"
        />
        {/* Preview thumbnails */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {book.imageLinks && (
            <>
              {Object.values(book.imageLinks)
                .slice(0, 4)
                .map((img, i) => (
                  <div key={i} className="relative w-16 h-16 cursor-pointer">
                    <img
                      src={img}
                      alt={`Preview ${i}`}
                      className="w-full h-full object-cover rounded shadow hover:opacity-80 transition"
                      onClick={() => {
                        setPreviewIndex(i);
                        setShowPreview(true);
                      }}
                    />
                  </div>
                ))}

              {/* More box */}
              {Object.values(book.imageLinks).length > 4 && (
                <div
                  className="relative w-16 h-16 flex items-center justify-center bg-gray-700 text-white text-lg font-semibold rounded cursor-pointer hover:bg-gray-600 transition"
                  onClick={() => setShowPreview(true)}
                >
                  +{Object.values(book.imageLinks).length - 4}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 border border-[#4b2e2a] rounded hover:bg-[#4b2e2a] hover:text-white transition">
            🛒 Add to Cart
          </button>
          <button className="px-4 py-2 bg-[#b74e3a] text-white rounded hover:bg-[#9d3c2e] transition">
            👁 Preview
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="col-span-8 space-y-8">
        {/* SECTION 1: Overview */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-[#6b4f45] mb-3">
            by <span className="font-semibold">{book.authors?.join(", ") || "Unknown"}</span>
          </p>

          <p className="text-lg mb-2">⭐ {book.averageRating || "No rating yet"}</p>
          <div className="text-3xl text-[#b74e3a] font-bold mb-4">{price}</div>

          <div className="text-sm text-[#6b4f45] space-y-1">
            <p>
              <strong>Nhà cung cấp:</strong> {book.publisher || "Unknown"}
            </p>
            <p>
              <strong>Ngày xuất bản:</strong> {book.publishedDate || "N/A"}
            </p>
            <p>
              <strong>Ngôn ngữ:</strong> {book.language?.toUpperCase() || "N/A"}
            </p>
          </div>
        </section>
        {/* SECTION 2: Detailed Info */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
          <table className="text-sm w-full">
            <tbody>
              <tr>
                <td className="py-1 font-medium">NXB</td>
                <td>{book.publisher || "Unknown"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Ngày XB</td>
                <td>{book.publishedDate || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Số trang</td>
                <td>{book.pageCount || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Loại</td>
                <td>{book.printType || "Book"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Thể loại</td>
                <td>{book.categories?.join(", ") || "General"}</td>
              </tr>
            </tbody>
          </table>
        </section>
        {/* SECTION 3: Description */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h2>
          <div
            className="text-sm leading-relaxed text-[#4b2e2a]"
            dangerouslySetInnerHTML={{ __html: book.description || "No description available." }}
          />
        </section>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#4b2e2a] text-white rounded-lg hover:bg-[#6b4f45] transition cursor-pointer"
        >
          ← Back
        </button>
      </div>
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-5 right-8 text-white text-3xl font-bold"
            onClick={() => setShowPreview(false)}
          >
            ✕
          </button>

          <div className="flex flex-col items-center">
            <img
              src={Object.values(book.imageLinks)[previewIndex]}
              alt="Preview full"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {Object.values(book.imageLinks).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Preview ${i}`}
                  onClick={() => setPreviewIndex(i)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer ${
                    i === previewIndex ? "border-2 border-[#b74e3a]" : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
