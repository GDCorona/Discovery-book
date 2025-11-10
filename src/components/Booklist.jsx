import { Link } from "react-router-dom";

export default function Booklist({view, filtered, setSelected, currency}){
    return(
        <section className="col-span-9">
        <div className="flex items-center justify-between mb-4">
            <div>
            <h2 className="text-lg font-semibold">Books</h2>
            <p className="text-sm text-[#6b4f45]">Showing {filtered.length} results</p>
            </div>

            <div className="text-sm text-[#6b4f45]">Explore thousands of titles — fetched live from Google Books</div>
        </div>
        {/* GRID VIEW */}
        {view === "grid" ? (
            <div className="grid grid-cols-4 gap-5">
            {filtered.map((b) => (
                <Link to={`/book/${b.id}`}>
                <article key={b.id} className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer h-full">
                    <div className="relative">
                        <img src={b.cover} alt={b.title} className="w-full h-50 object-contain"/>
                    </div>

                    <div className="p-3 flex flex-col grow justify-between">
                        <div className="min-h-15">
                            <h3 className="font-semibold text-sm line-clamp-2 ">
                                {b.title}
                            </h3>
                            <p className="text-xs text-[#6b4f45] line-clamp-1">
                                by {(b.authors && b.authors.join(", ")) || b.author || "Unknown"}
                            </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <div className="font-semibold">{currency(b.price)}</div>
                            <div className="text-xs text-[#6b4f45]">⭐ {b.rating}</div>
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
                <div key={b.id} className="bg-white rounded-lg shadow-sm p-3 flex gap-4 items-center">
                <img src={b.cover || "https://via.placeholder.com/100x150?text=No+Cover"} alt={b.title} className="w-28 h-36 object-cover rounded" />
                <div className="flex-1">
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-[#6b4f45]">
                        by {(b.authors && b.authors.join(", ")) || b.author || "Unknown"} •{" "}
                        {b.genre || "General"}
                    </p>
                    <p className="mt-2 text-sm text-[#6b4f45]">{b.description}</p>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="font-semibold">{currency(b.price)}</div>
                        <div className="flex gap-2">
                            <button onClick={() => setSelected(b)} className="px-3 py-2 border rounded hover:bg-[#f7f3f1]">Quick View</button>
                            <button className="px-3 py-2 rounded bg-[#4b2e2a] text-white hover:bg-[#3a221f]">Add to cart</button>
                        </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </section>
    );
}