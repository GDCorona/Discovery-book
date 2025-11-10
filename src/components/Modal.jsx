export default function Modal({selected, setSelected, currency, mockBooks}){
    if (!selected) return null; //render nothing if no book is selected
    return(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-3xl p-6 shadow-lg">
                <div className="flex gap-4">
                    <img src={selected.cover} alt="cover" className="w-40 h-56 object-cover rounded" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold">{selected.title}</h3>
                                <p className="text-sm text-[#6b4f45]">by {selected.author} — {selected.genre}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-[#6b4f45]">✕</button>
                        </div>

                        <p className="mt-3 text-sm text-[#6b4f45]">{selected.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-semibold">{currency(selected.price)}</div>
                                {selected.oldPrice && <div className="text-sm line-through text-[#9b7a71]">{currency(selected.oldPrice)}</div>}
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 rounded bg-[#4b2e2a] text-white">Add to cart</button>
                                <button className="px-4 py-2 border rounded" onClick={() => {
                                // simulate "go to product page"
                                alert('Open product page for ' + selected.title);
                                }}>View page</button>
                            </div>
                        </div>

                        {/* Similar books */}
                        <div className="mt-6">
                            <h4 className="font-semibold">You might also like</h4>
                            <div className="flex gap-3 mt-3">
                                {selected.similar.map((sid) => {
                                const s = mockBooks.find((x) => x.id === sid);
                                if (!s) return null;
                                return (
                                    <div key={sid} className="w-36 bg-[#fff6f4] p-2 rounded">
                                    <img src={s.cover} className="w-full h-20 object-cover rounded" />
                                    <div className="text-xs mt-2 font-semibold">{s.title}</div>
                                    <div className="text-xs text-[#6b4f45]">{currency(s.price)}</div>
                                    </div>
                                );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}