export default function Filter({genres, genre, setGenre, setQuery}){
    return (
        <aside className="col-span-3 bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Filters</h3>

        <label className="block text-sm text-[#6b4f45]">Genre</label>
        <select
            className="w-full mb-3 mt-1 p-2 border rounded"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}>
            {genres.map((g) => (
            <option key={g} value={g}>
                {g}
            </option>
            ))}
        </select>

        <label className="block text-sm text-[#6b4f45]">Author</label>
        <select
            className="w-full mb-3 mt-1 p-2 border rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}>
            {authors.map((a) => (
            <option key={a} value={a}>
                {a}
            </option>
            ))}
        </select>

        <label className="block text-sm text-[#6b4f45]">Price (VND)</label>
        <div className="flex gap-2 mt-1">
            <input
            type="number"
            className="w-1/2 p-2 border rounded"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
            />
            <input
            type="number"
            className="w-1/2 p-2 border rounded"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value || 1000000)])}
            />
        </div>

        <label className="block text-sm text-[#6b4f45] mt-3">Sort</label>
        <select className="w-full mt-1 p-2 border rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top rated</option>
        </select>

        <div className="mt-4 flex gap-2">
            <button
            onClick={() => {
                setQuery("");
                setGenre("all");
                setAuthor("all");
                setPriceRange([0, 1000000]);
                setSort("relevance");
            }}
            className="px-3 py-2 rounded bg-[#4b2e2a] text-white w-full">
            Reset
            </button>
        </div>
        </aside>
    );
}