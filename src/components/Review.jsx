import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Collect all reviews_* keys
  const myReviews = Object.keys(localStorage)
    .filter((key) => key.startsWith("reviews_"))
    .flatMap((key) => {
      const bookId = key.replace("reviews_", "");
      const reviews = JSON.parse(localStorage.getItem(key)) || [];
      return reviews
        .filter((r) => r.username === user.username)
        .map((r) => ({
          ...r,
          bookId,
        }));
    });

  const goToReview = (review) => {
    navigate(`/book/${review.bookId}#review-${review.id}`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Nhận xét của tôi</h1>

      {myReviews.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có nhận xét nào.</p>
      ) : (
        <div className="space-y-4">
          {myReviews.map((r) => (
            <div
              key={r.id}
              onClick={() => goToReview(r)}
              className="flex gap-4 p-4 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition"
            >
              {/* Book cover */}
              <img
                src={r.bookCover}
                alt={r.bookTitle}
                className="w-16 h-20 object-cover rounded"
              />

              {/* Review info */}
              <div className="flex-1">
                <p className="font-semibold line-clamp-1">
                  {r.bookTitle}
                </p>

                <p className="text-sm text-yellow-500">
                  {"⭐".repeat(r.rating)}
                </p>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {r.comment}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
