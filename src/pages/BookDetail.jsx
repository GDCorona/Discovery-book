import React, { useEffect, useState } from "react";
import useIcons from "../hooks/useIcons.js";
import { useParams, useNavigate} from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useFavorite } from "../context/FavContext.jsx";

export default function BookDetail() {
  const icons = useIcons();
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { addToCart, isInCart } = useCart();
  const [qty, setQty] = useState(1); //store item quantity
  const handleBuyNow = () => {
    const exists = isInCart(id);
    if (!exists) {
      addToCart(
        {
          id,
          title: book.title,
          price,
          cover: book.imageLinks?.thumbnail || "",
        },
        qty,
        false // no toast
      );
    }
    navigate("/cart");
  };
  //Add to favorite
  const { toggleFavorite, isFavorite } = useFavorite();
  
  //Comment logic
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [price, setPrice] = useState("");
  const handleSubmitReview = () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao.");
      return;
    }
    if (comment.trim() === "") {
      alert("Vui lòng viết nhận xét.");
      return;
    }

    setReviews([...reviews, { rating, comment }]);
    setRating(0);
    setComment("");
  };
  const averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
      const data = await res.json();
      setBook(data.volumeInfo);
      setMainImage(data.volumeInfo.imageLinks?.thumbnail);
      setLoading(false);
      // PRICE SHOULD BE COMPUTED ONCE
      const randomPrice = (Math.floor(Math.random() * 300000) + 50000);
      setPrice(randomPrice);
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center">Đang tải thông tin sách...</p>;
  if (!book) return <p className="text-center">Book not found.</p>;
  return (
    
    <div className="grid grid-cols-12 gap-8 mt-8">
      {/* Left panel */}
      <div className="col-span-5">
      <div className="sticky top-4 p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
        <img
          src={mainImage || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-64 h-auto rounded-lg shadow-md object-contain bg-white p-4"
        />
        {/* Preview thumbnails */}
        <div className="flex gap-2 mt-4 justify-center">
          {book.imageLinks && (
            <>
              {Object.values(book.imageLinks)
                .slice(0, 4)
                .map((img, i) => (
                  <div key={i} className="relative w-20 h-20 cursor-pointer">
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
                  className="relative w-20 h-20 flex items-center justify-center bg-gray-700 text-white text-xl font-semibold rounded cursor-pointer hover:bg-gray-600 transition"
                  onClick={() => setShowPreview(true)}
                >
                  +{Object.values(book.imageLinks).length - 4}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 mt-4 text-lg">
          <button
            className="px-10 py-3 border border-[#4b2e2a] rounded transition hover:bg-[#4b2e2a] hover:text-white"
            onClick={() => {
                addToCart({
                  id,
                  title: book.title,
                  price,
                  cover: book.imageLinks?.thumbnail || "",
                }, qty);
              }
            }
          >
            🛒 Thêm vào giỏ hàng
          </button>
          <button 
            className="px-10 py-3 bg-[#b74e3a] text-white rounded hover:bg-[#9d3c2e] transition"
            onClick={handleBuyNow}
          >
            Mua ngay
          </button>
        </div>
      </div>
      </div>
      {/* Right panel */}
      <div className="col-span-7 space-y-8">
        {/* SECTION 1: Overview */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-[#6b4f45] mb-3 text-lg">
            by <span className="font-semibold">{book.authors?.join(", ") || "Unknown"}</span>
          </p>
          <div className="text-base text-[#6b4f45] space-y-1">
            <p>
              <strong>Tình trạng:</strong> Còn hàng
            </p>
          </div>
          <p className="text-lg mt-2 mb-2">⭐ {book.averageRating || "Chưa có đánh giá"}</p>
          <div className="text-3xl text-[#b74e3a] font-bold mb-5">{price.toLocaleString("vi-VN")} ₫</div>
          <div className="flex items-center justify-between">
            {/* Quantity controller */}
            <div className="flex items-center justify-between gap-5">
                <p className="text-lg font-semibold">Số lượng: </p>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-lg rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 font-semibold tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="px-3 py-2 text-lg rounded hover:bg-gray-100"
                  >
                    +
                  </button>
              </div>
            </div>
            {/* Add to favorite */}
            <button
              onClick={() =>
                toggleFavorite({
                  id,
                  title: book.title,
                  authors: book.authors,
                  price,
                  cover: book.imageLinks?.thumbnail || "",
                })
              }
              className="w-10 h-10 flex items-center justify-center border-2 border-[#6b4f45] rounded shadow-lg transition duration-300 hover:scale-105"
              title={isFavorite(id) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              <img src={isFavorite(id) ? icons.heart1 : icons.heart} className="w-7 h-7"></img>
            </button>
          </div>
        </section>
        {/* SECTION 2: Detailed Info */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
          <table className="text-base w-full">
            <tbody>
              <tr>
                <td className="py-1 font-medium">Tác giả</td>
                <td>{book.authors?.join(", ") || "Unknown"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">NXB</td>
                <td>{book.publisher || "Unknown"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Ngày XB</td>
                <td>{book.publishedDate || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Ngôn ngữ</td>
                <td>{book.language?.toUpperCase() || "N/A"}</td>
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
            dangerouslySetInnerHTML={{ __html: book.description || "Không có mô tả" }}
          />
        </section>
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
      {/* SECTION 4: Ratings & Comments */}
      <section className="bg-white p-6 rounded-lg shadow space-y-6 col-span-12">
        <h2 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h2>
        {/* Rating Summary */}
        <div className="border-b pb-6">
          {/* Average Rating */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="text-yellow-400 text-2xl">
              {"★".repeat(Math.round(averageRating))}
              <span className="text-gray-300">
                {"★".repeat(5 - Math.round(averageRating))}
              </span>
            </div>
            <span className="text-sm text-gray-600 mt-2">
              ({reviews.length} đánh giá)
            </span>
          </div>
          {/* Rating Bars */}
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-lg">
                  <span className="w-12">{star} ★</span>

                  {/* Bar Container */}
                  <div className="w-1/3 h-3 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <span className="w-12 text-gray-600">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-3">Nhận xét</h3>
        {/* Star Rating Input */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer transition ${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        {/* Comment Box */}
        <textarea
          className="w-full border rounded p-3 text-sm focus:ring focus:ring-[#b74e3a]"
          rows="4"
          placeholder="Viết nhận xét của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {/* Submit Button */}
        <button
          className="px-5 py-2 bg-[#4b2e2a] text-white rounded hover:bg-[#6b4f45] transition"
          onClick={handleSubmitReview}
        >
          Gửi nhận xét
        </button>
        {/* Reviews List */}
        <div className="space-y-4 mt-6">
          {reviews.length === 0 && <p className="text-gray-500">Chưa có nhận xét nào.</p>}
          {reviews.map((r, i) => (
            <div key={i} className="border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Người dùng {i + 1}</span>
                <span className="text-yellow-400">
                  {"★".repeat(r.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - r.rating)}
                  </span>
                </span>
              </div>
              <p className="text-sm mt-1 text-[#4b2e2a]">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
