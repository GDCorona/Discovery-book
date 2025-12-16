import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useIcons from "../hooks/useIcons.js";
import AccountInfo from "../components/AccountInfo.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import Favorite from "../components/Favorite.jsx";
export default function Account() {
  const icons = useIcons();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");   // redirect to homepage
    }
  }, [user, loading, navigate]);

  const location = useLocation();
  const [active, setActive] = useState(
    location.state?.tab || "Hồ sơ cá nhân"
  );
  useEffect(() => {
    if (location.state?.tab) {
      setActive(location.state.tab);
    }
  }, [location.state]);


  const menuItems = [
    "Hồ sơ cá nhân",
    "Đổi mật khẩu",
    "Đơn hàng của tôi",
    "Ưu đãi thành viên",
    "Ví voucher",
    "Thông Báo",
    "Sản phẩm yêu thích",
    "Nhận xét của tôi",
  ];
  if (!user) return null;
  if (loading) return null;
  return (
    <div className="flex gap-6 mt-10 px-10 h-[1000px]">

      {/* ========== LEFT SIDEBAR ========== */}
      <div className="w-80 bg-white rounded-xl shadow p-6">

        {/* Avatar + Name */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl">
            <img
              src={user.avatar || icons.account}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
          </div>

          <p className="mt-3 text-2xl font-semibold">{user.username}</p>
          <p className="text-base text-gray-500">Thành viên Bạc</p>
        </div>

        <hr className="my-4" />

        {/* Menu */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => setActive(item)}
              className={`cursor-pointer px-3 py-3 rounded-lg text-lg
                ${active === item ? "text-[#b74e3a] font-semibold bg-[#f5e9e5]" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ========== RIGHT PANEL ==========  */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow">
        {active === "Hồ sơ cá nhân" && <AccountInfo />}
        {active === "Đổi mật khẩu" && <ChangePassword />}
        {active === "Sản phẩm yêu thích" && <Favorite />}
      </div>
    </div>
  );
}
