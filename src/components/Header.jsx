import { useState, useEffect, useRef } from "react";
import useIcons from "../hooks/useIcons.js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header(){
  const icons = useIcons();
  const navigate = useNavigate();

  //Language logic
  const [lang, setLang] = useState("vi");
  const toggleLanguage = () => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  };
  //Cart logic
  const { cart, totalItems, totalPrice } = useCart();
  const MAX_VISIBLE_ITEMS = 6;
  const visibleItems = cart.slice(0, MAX_VISIBLE_ITEMS);
  const hasMoreItems = cart.length > MAX_VISIBLE_ITEMS;
  //Login logic
  const { user, login, register, logout } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [showAuthModal, setShowAuthModal] = useState(false);
  const modalRef = useRef(null);
  useEffect(() => {
  const openLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  window.addEventListener("open-login-modal", openLogin);
    return () => window.removeEventListener("open-login-modal", openLogin);
  }, []);

  useEffect(() => {
    if (!showAuthModal) return;
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowAuthModal(false);
        setErrors({});
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAuthModal]);
  const handleLoginSubmit = (e) => {
    e.preventDefault();               
    let newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập hoặc email.";
    }
    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const res = login(username, password);
    if (!res.success) {
      setErrors({ [res.field]: res.msg });
      return;
    }
    setErrors({});
    setShowAuthModal(false);            
  }
  const handleSignupSubmit = (e) => {
    e.preventDefault();                
    let newErrors = {};
    // VALIDATIONS
    if (!username.trim()) newErrors.username = "Tên không được để trống.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      newErrors.email = "Email không hợp lệ.";
    if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password))
      newErrors.password =
        "Mật khẩu phải có cả chữ và số.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // REGISTER
    const res = register({ username, email, password });
    if (!res.success) {
      setErrors({ [res.field]: res.msg });
      return;
    }
    // SUCCESS
    setAuthMode("login");
    setErrors({});       
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const eyeOpen = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  const eyeClosed = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.223-3.592m3.027-2.346A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.975 9.975 0 01-4.043 5.362M15 12a3 3 0 00-4.243-2.828M9.88 9.88A3 3 0 0012 15m0 0a3 3 0 01-2.12-.88M3 3l18 18" />
    </svg>
  );

  const [errors, setErrors] = useState({});
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  //Log out popup
  const [logoutMsg, setLogoutMsg] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);

  // ===== SEARCH SUGGESTIONS =====
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
          )}&maxResults=5`
        );
        const data = await res.json();
        const mapped =
          data.items?.map((b) => ({
            id: b.id,
            title: b.volumeInfo.title,
            cover:
              b.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/60x90",
          })) || [];
        setSuggestions(mapped);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // debounce
    return () => clearTimeout(timeout);
  }, [query]);
  //Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  //Apply search, accept both search icon and enter key
  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    navigate(`/category?query=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };
  //Book categories
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
    }, 150);
  };
  const cancelCloseTimer = () => {
    clearTimeout(closeTimerRef.current);
  };
  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);
  return(
    <header className="flex items-center justify-around mb-6">
      {/* ===== Left: Logo ===== */}
      <div onClick={() => navigate("/")} className="flex items-center gap-1 cursor-pointer">
        <img src = {icons.logo}></img>
        <h1  className="text-4xl font-extrabold text-[#4b2e2a] font-mono amarante-regular">
          Discovery Book
        </h1>
      </div>

      {/* ===== Middle: Categories + Search ===== */}
      <div className="relative flex items-center gap-3">
        {/* Category dropdown */}
        <div
          onMouseEnter={() => { cancelCloseTimer(); setOpen(true); }}
          onMouseLeave={() => startCloseTimer()}
        >
          <button className="flex items-center px-4 py-2">
            <img src={icons.category} className="w-8 h-8" alt="category" />
            <img src={icons.arrow} className="w-5 h-5" alt="arrow"/>
          </button>

          {/* Dropdown container */}
          <div
            className={`absolute left-1/2 top-full mt-4 -translate-x-1/2 w-[1000px] bg-white border border-gray-200 rounded-lg shadow-lg flex z-50 transition-all duration-300 ${
              open ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
            }`}
          >
            {/* Left: main categories */}
            <div className="w-1/4 border-r border-gray-200 p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Danh mục sản phẩm</h3>
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

            {/* Right: subcategories */}
            <div className="w-3/4 p-6 grid grid-cols-3 gap-6">
              {hoveredCategory ? (
                hoveredCategory.subcategories.map((sub) => (
                  <div key={sub.title}>
                    <h4 className="font-semibold text-[#4b2e2a] mb-2">{sub.title}</h4>
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
                  Chọn một danh mục để xem các danh mục con
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative" ref={searchRef}>
          <input
            aria-label="quick-search"
            className="px-3 py-2 rounded-lg border border-[#e6ded9] shadow-md w-120 pr-10"
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
          />
          <button
            onClick={handleSearchSubmit}
            className="absolute right-0 top-0 flex items-center justify-center w-10 h-full bg-[#4b2e2a] rounded-r-lg hover:bg-[#6b4f45] transition"
          >
            <img src={icons.search} alt="search" className="w-5 h-5" />
          </button>
          {/* SEARCH SUGGESTIONS */}
          {showSuggestions && query && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-50">
              {searchLoading ? (
                <p className="p-3 text-sm text-gray-500">Đang tìm kiếm...</p>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        navigate(`/book/${b.id}`);
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={b.cover}
                        className="w-10 h-14 object-cover rounded"
                        alt={b.title}
                      />
                      <p className="text-sm line-clamp-2">{b.title}</p>
                    </div>
                  ))}

                  {/* VIEW MORE */}
                  <button
                    onClick={() => {
                      navigate(`/category?query=${encodeURIComponent(query)}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-center py-2 text-sm font-medium text-[#b74e3a] hover:bg-gray-50 border-t"
                  >
                    Xem thêm kết quả
                  </button>
                </>
              ) : (
                <p className="p-3 text-sm text-gray-500">Không tìm thấy kết quả</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Right: Icons ===== */}
      <div className="flex items-center gap-7">
        {/* Language switch */}
        <button
          onClick={() => toggleLanguage()}
          className="flex items-center justify-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 min-w-[120px]"
        >
          <img src={icons.language} alt="language" className="w-5 h-5" />
          <span className="text-sm font-medium">
            {lang === "vi" ? "Tiếng Việt" : "English"}
          </span>
        </button>
        {/* Notifications (hover popup) */}
        <div
          className="relative group"
        >
          <button className="relative">
            <img src={icons.bell} alt="notifications" className="w-6 h-6" />
            {user && totalItems > 0 && (
              <span className="opacity-0 absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          {/* Popup */}
          <div
            className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg border border-gray-200 p-3 z-50 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 translate-y-2 group-hover:translate-y-0"
          >
            <h3 className="font-semibold text-lg mb-2">Thông báo</h3>

            <ul className="space-y-2 text-sm">
              <li className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                {user ? (
                  <p>Bạn không có thông báo nào</p>
                ) : (
                  <p>Hãy đăng nhập để xem thông báo</p>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Cart */}
        <div className="relative group">
          <button className="relative">
            <img src={icons.cart} alt="cart" className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hover Popup */}
          <div
            className="
              absolute right-0 mt-3 w-100 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-50
              opacity-0 invisible translate-y-2
              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
              transition-all duration-200
            "
          >
            <h3 className="font-semibold text-lg mb-2">Giỏ hàng</h3>

            <div className="space-y-3">
              {cart.length === 0 ? (
                /* Empty cart */
                <p className="text-sm text-gray-500">Chưa có sản phẩm.</p>
              ) : (
                <>
                  {/* Has items */}
                  {visibleItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => navigate(`/book/${item.id}`)} 
                      className="flex items-center gap-3 cursor-pointer transition duration-300 hover:bg-gray-100"
                    >
                      <img src={item.cover} className="w-12 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-[#6b4f45]">
                          {item.price.toLocaleString("vi-VN")} ₫ × {item.quantity}
                        </p>
                      </div>
                    </div> 
                  ))}
                  {/* View more */}
                  {hasMoreItems && (
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-full text-sm text-[#b74e3a] hover:underline text-center"
                    >
                      Xem thêm
                    </button>
                  )}
                </>
              )}
              <div className="flex items-center justify-between pt-3 mt-3 border-t">
                <span className="font-semibold text-[#4b2e2a]">
                  Tổng: {totalPrice.toLocaleString("vi-VN")} ₫
                </span>
                <button
                  onClick={() => navigate("/cart")}
                  className="px-5 py-2 bg-[#4b2e2a] text-white text-md rounded hover:bg-[#6b4f45]"
                >
                  Xem giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="relative" ref={menuRef}>
          {!user ? (
            /* Not logged in → show sign-in button */
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Đăng nhập
            </button>

          ) : (
            <>
              {/* Avatar button */}
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-300"
              >
                <img
                  src={user.avatar || icons.account}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown menu */}
              <div
                className={`absolute right-0 mt-3 w-56 z-10 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-200 ${
                  openMenu ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <ul className="text-md text-[#4b2e2a]">
                  <li
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/account", {state: { tab: "Hồ sơ cá nhân" }})}
                  >
                    <img src={icons.account1} className="w-5 h-5"></img>
                    Thông tin tài khoản
                  </li>
                  <li
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/account", {state: { tab: "Đơn hàng của tôi" }})}
                  >
                    <img src={icons.bill} className="w-5 h-5"></img>
                    Đơn hàng của tôi
                  </li>
                  <li 
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/account", {state: { tab: "Sản phẩm yêu thích" }})}
                  >
                    <img src={icons.heart1} className="w-5 h-5"></img>
                    Sản phẩm yêu thích
                  </li>
                  <li 
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/account", {state: { tab: "Ví voucher" }})}
                  >
                    <img src={icons.voucher} className="w-5 h-5"></img>
                    Ví voucher
                  </li>
                  <hr />
                  <li
                    onClick={() => {
                      logout();
                      setLogoutMsg(true);
                      setCountdown(5);
                      // Clear existing interval if any
                      if (intervalRef.current) clearInterval(intervalRef.current);
                      intervalRef.current = setInterval(() => {
                        setCountdown((prev) => {
                          if (prev <= 1) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                            navigate("/");
                            return 0;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }}
                    className="flex items-center gap-3 px-5 py-4 text-red-500 font-medium rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={icons.logout} className="w-5 h-5"></img>
                    Thoát tài khoản
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-lg w-110 relative min-h-[500px]">

            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            {/* Tabs */}
            <div className="flex mb-10 border-b">
              <button
                className={`flex-1 py-2 text-center font-semibold ${
                  authMode === "login" ? "text-[#4b2e2a] border-b-2 border-[#4b2e2a]" : "text-gray-500"
                }`}
                onClick={() => {
                  setAuthMode("login");
                  setErrors({});
                }}
              >
                Đăng nhập
              </button>
              <button
                className={`flex-1 py-2 text-center font-semibold ${
                  authMode === "signup" ? "text-[#4b2e2a] border-b-2 border-[#4b2e2a]" : "text-gray-500"
                }`}
                onClick={() => {
                  setAuthMode("signup");
                  setErrors({});
                }}
              >
                Đăng ký
              </button>
            </div>

            {/* ================= LOGIN FORM ================= */}
            {authMode === "login" && (
              <form className="mb-2" onSubmit={handleLoginSubmit}>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập hoặc Email"
                    className={`w-full p-2 border rounded ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors({});
                    }}
                  />
                  <p className="text-red-500 text-sm h-4 mt-1">
                    {errors.username || ""}
                  </p>
                </div>
                <div className="relative mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className={`w-full p-2 border rounded ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({});
                    }}
                  />
                  {/* Eye Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-[35%] -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? eyeOpen : eyeClosed}
                  </button>
                  <p className="text-red-500 text-sm h-4 mt-1">
                    {errors.password || ""}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4b2e2a] text-white mt-3 py-3 rounded hover:bg-[#6b4f45]"
                >
                  Đăng nhập
                </button>
              </form>
            )}
            {/* ================= SIGNUP FORM ================= */}
            {authMode === "signup" && (
              <form onSubmit={handleSignupSubmit}>
                {/* Username */}
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    className={`w-full p-2 border rounded ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors({});
                    }}
                  />
                  <p className="text-red-500 text-sm h-4 mt-1">
                    {errors.username || ""}
                  </p>
                </div>
                {/* Email */}
                <div className="mb-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className={`w-full p-2 border rounded ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                  />
                  <p className="text-red-500 text-sm h-4 mt-1">
                    {errors.email || ""}
                  </p>
                </div>
                {/* Password */}
                <div className="relative mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className={`w-full p-2 border rounded ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({});
                    }}
                  />
                  {/* Eye Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-[35%] -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? eyeOpen : eyeClosed}
                  </button>
                  <p className="text-red-500 text-sm h-4 mt-1">
                    {errors.password || ""}
                  </p>
                </div>
                {/* Confirm Password */}
                <div className="relative mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full p-2 border rounded ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({});
                    }}
                  />
                  <p className="text-red-500 text-sm h-4 mt-1">
                    {errors.confirmPassword || ""}
                  </p>
                </div>
                {/* Terms & Conditions */}
                <p className="mb-2 text-sm">
                  Bằng việc tiếp tục, bạn đã đọc và đồng ý với
                  <span className="text-blue-500 cursor-pointer hover:text-blue-800"> điều khoản sử dụng </span>
                  &
                  <span className="text-blue-500 cursor-pointer hover:text-blue-800"> chính sách bảo mật </span>
                  của chúng tôi.
                </p>
                <button
                  type="submit"
                  className="w-full bg-[#4b2e2a] text-white mt-3 py-3 rounded hover:bg-[#6b4f45]"
                >
                  Đăng ký
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Logout popup */}
      {logoutMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center animate-fade-in">
            <h2 className="text-lg font-semibold mb-2">Bạn đã đăng xuất</h2>

            <p className="text-sm text-gray-600 mb-4">
              Đang chuyển hướng về trang chủ trong <b>{countdown}s</b>...
            </p>

            <button
              onClick={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                setLogoutMsg(false);
                navigate("/");
              }}
              className="w-full py-2 bg-[#4b2e2a] text-white rounded-lg font-semibold hover:bg-[#6b4f45] transition"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}

    </header>
    
  );
}
