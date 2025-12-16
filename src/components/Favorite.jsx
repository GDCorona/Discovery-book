import { Link } from "react-router-dom";
import { useFavorite } from "../context/FavContext.jsx";

export default function Favorite() {
  const { favorites, removeFavorite } = useFavorite();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">Chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {favorites.map((b) => (
            <div key={b.id} className="bg-white rounded-lg shadow p-3 relative">
              <button
                onClick={() => removeFavorite(b.id)}
                className="absolute top-0 right-2 text-[#4b2e2a] text-base"
                title="Bỏ yêu thích"
              >
                ✕
              </button>

              <Link to={`/book/${b.id}`}>
                <img src={b.cover} className="w-full h-40 object-contain mb-3" />
                <h3 className="font-semibold line-clamp-2">{b.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {b.authors?.join(", ") || "Unknown"}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
