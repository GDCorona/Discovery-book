import { Link } from "react-router-dom";
import { FaThLarge, FaList } from "react-icons/fa";

export default function Booklist({view, setView, filtered, currency, sort, setSort}){
  
  return(
  <section className="col-span-9 max-w-7xl mx-auto">
    {/* Header row: title, result count, and view toggle */}
    <div className="flex items-center justify-between mb-6">
      {/* Left side: result info */}
      <div>
        <h2 className="text-lg font-semibold">Sách</h2>
      </div>

      {/* Right side: view + sort */}
      <div className="flex items-center gap-2">
        {/* Sort */}
        <h3 className="font-semibold text-lg">Sắp xếp theo: </h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-7 py-1 mr-7 text-base"
        >
          <option value="relevance">Liên quan nhất</option>
          <option value="az">Tên A → Z</option>
          <option value="za">Tên Z → A</option>
          <option value="price-low">Giá thấp → cao</option>
          <option value="price-high">Giá cao → thấp</option>
        </select>
        {/* Grid/list toggle buttons */}
        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded transition ${
            view === "grid"
              ? "bg-[#4b2e2a] text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-600"
          }`}
          title="Chế độ lưới"
        >
          <FaThLarge className="w-5 h-5" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded transition ${
            view === "list"
              ? "bg-[#4b2e2a] text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-600"
          }`}
          title="Chế độ danh sách"
        >
          <FaList className="w-5 h-5" />
        </button>
      </div>
    </div>
      {/* GRID VIEW */}
      {view === "grid" ? (
          <div className="grid grid-cols-4 gap-5">
          {filtered.map((b) => (
              <Link to={`/book/${b.id}`}>
              <article key={b.id} className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer h-full transition duration-500 hover:scale-101 hover:shadow-lg">
                  <div className="relative">
                      <img src={b.cover} alt={b.title} className="w-full h-50 object-contain"/>
                  </div>

                  <div className="p-3 flex flex-col grow justify-between">
                      <div className="min-h-15">
                          <h3 className="font-semibold text-base line-clamp-2 ">
                              {b.title}
                          </h3>
                          <p className="text-sm text-[#6b4f45] line-clamp-1">
                              by <span className="font-semibold">{(b.authors && b.authors.join(", ")) || b.author || "Unknown"}</span>
                          </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                          <div className="font-semibold text-lg text-[#b74e3a]">{currency(b.price)}</div>
                          <div className="text-base text-[#6b4f45]">⭐ {b.rating}</div>
                      </div>
                  </div>
              </article>
              </Link>
          ))}
          </div>
      ) : (
          // LIST VIEW
          <div className="flex flex-col gap-3">
          {filtered.map((b) => (
              <Link to={`/book/${b.id}`}>
                <div key={b.id} className="bg-white rounded-lg shadow-sm p-3 flex gap-4 transition duration-500 hover:scale-101 hover:shadow-lg">
                  <img src={b.cover || "https://via.placeholder.com/100x150?text=No+Cover"} alt={b.title} className="w-28 h-36 object-cover rounded" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{b.title}</h3>
                      <p className="text-base text-[#6b4f45]">
                          by <span className="font-semibold">{(b.authors && b.authors.join(", ")) || b.author || "Unknown"}</span>
                      </p>
                      <p className="text-sm line-clamp-2">{b.description}</p>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-semibold text-lg text-[#b74e3a]">{currency(b.price)}</div>
                      <div className="text-base text-[#6b4f45]">⭐ {b.rating}</div>
                    </div>
                  </div>
                </div>
              </Link>
          ))}
          </div>
      )}
      </section>
  );
}