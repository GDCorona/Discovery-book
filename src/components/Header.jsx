import { useState, useEffect, useRef } from "react";
import categoryIcon from "../assets/category.svg";
import searchIcon from "../assets/search.svg";

export default function Header({ query, setQuery, view, setView, genres, genre, setGenre}){
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const closeTimerRef = useRef(null);
  const categories = [
      {
        name: "Sách Tiếng Việt",
        subcategories: [
          { title: "VĂN HỌC", items: ["Tiểu Thuyết", "Ngôn Tình", "Truyện Ngắn", "Light Novel"] },
          { title: "KINH TẾ", items: ["Quản Trị - Lãnh Đạo", "Marketing - Bán Hàng", "Khởi Nghiệp - Làm Giàu", "Phân Tích Kinh Tế"] },
          { title: "TÂM LÝ - KỸ NĂNG SỐNG", items: ["Kỹ Năng Sống", "Rèn Luyện Nhân Cách", "Tâm Lý", "Sách Cho Tuổi Mới Lớn"] },
          { title: "TIỂU SỬ - HỒI KÝ", items: ["Câu Chuyện Cuộc Đời", "Nghệ Thuật - Giải Trí", "Chính Trị", "Thể Thao"] },
          { title: "SÁCH THIẾU NHI", items: ["Truyện Tranh", "Tô Màu, Luyện Chữ", "Kiến Thức Bách Khoa", "Sách Nói"] },
          { title: "SÁCH HỌC NGOẠI NGỮ", items: ["Tiếng Anh", "Tiếng Trung", "Tiếng Nhật", "Tiếng Pháp"] }
        ],
      },
      {
        name: "Sách Nước Ngoài",
        subcategories: [
          { title: "FICTION", items: ["Romance", "Fantasy", "Mystery"] },
          { title: "BUSINESS & MANAGEMENT", items: ["Economics", "Leadership", "Finance & Accounting", "Law"] },
          { title: "PERSONAL DEVELOPMENT", items: ["Personal Finance", "Consumer Advice", "Education"] },
          { title: "SOCIAL SCIENCE", items: ["Humanities", "Scociology", "Psychology", "Statistics"] },
          { title: "ENGINEERING", items: ["Mechanical", "Computer", "Electrical", "Civil"] },
          { title: "MEDICAL", items: ["Anatomy", "Nursing", "Medical Psychology", "Administration & Policy"] },
        ],
      },
      {
        name: "Sách Giáo Khoa",
        subcategories: [
          { title: "SÁCH GIÁO KHOA", items: ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12",] },
          { title: "SÁCH THAM KHẢO", items: ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12",] },
          { title: "LUYỆN THI THPTQG", items: ["Môn Toán", "Môn Ngữ Văn", "Môn Tiếng Anh", "Môn Vật Lý", "Môn Hóa Học", "Môn Sinh Học", "Môn Lịch Sử", "Môn Địa Lý"] }
        ],
      },
    ];
    const startCloseTimer = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setHoveredCategory(null);
    }, 150); // 150ms delay
  };

  const cancelCloseTimer = () => {
    clearTimeout(closeTimerRef.current);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);
    return(
        <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-[#4b2e2a] font-mono overline decoration-wavy">YuiHouNa</h1>
          <div className="relative flex items-center gap-3">
        <div className="relative"
        onMouseEnter={() => { cancelCloseTimer(); setOpen(true); }}
        onMouseLeave={() => startCloseTimer()}
        >
            <button className="flex items-center px-4 py-2 gap-2 cursor-pointer">
              <img src = {categoryIcon} className="w-10 h-10"></img>
              <span className=" text-gray-400 text-xl">v</span>
            </button>

            {/* Dropdown container */}
              <div className={`absolute top-full -left-full mt-2 w-[1000px] bg-white border border-gray-200 rounded-lg shadow-lg flex z-50 transition-opacity duration-300
              ${open == true
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }`}>
                {/* Left panel: main categories */}
                <div className="w-1/3 border-r border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Product Category
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((cat) => (
                      <li
                        key={cat.name}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        className={`cursor-pointer px-3 py-2 rounded ${
                          hoveredCategory?.name === cat.name
                            ? "bg-[#f4e9e2] text-[#b74e3a] font-medium"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right panel: subcategories */}
                <div className="w-2/3 p-6 grid grid-cols-3 gap-6">
                  {hoveredCategory ? (
                    hoveredCategory.subcategories.map((sub) => (
                      <div key={sub.title}>
                        <h4 className="font-semibold text-[#4b2e2a] mb-2">
                          {sub.title}
                        </h4>
                        <ul className="space-y-1">
                          {sub.items.map((item) => (
                            <li
                              key={item}
                              className="text-sm text-[#6b4f45] hover:text-[#b74e3a] cursor-pointer"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 italic">
                      Hover a category to see subcategories
                    </div>
                  )}
                </div>
              </div>
        </div>
     
            {/*search bar*/}
            <input
              aria-label="quick-search"
              className="px-3 py-2 rounded-lg border border-[#e6ded9] shadow-md w-md"
              placeholder="Quick search by title, author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => console.log("Searching:", query)} // replace this with your actual search handler
              className="absolute right-0 flex items-center justify-center w-15 h-10 rounded-lg bg-[#4b2e2a] hover:bg-[#6b4f45] transition cursor-pointer"
            >
              <img src={searchIcon} alt="search" className="w-5 h-5" />
            </button>

          </div>
            {/*toggle viewmode*/}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-2 rounded ${view === "grid" ? "bg-[#4b2e2a] text-white" : "bg-white"}`}>
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-2 rounded ${view === "list" ? "bg-[#4b2e2a] text-white" : "bg-white"}`}>
                List
              </button>
            </div>
        </header>
    );
}
