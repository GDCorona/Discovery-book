import { useState, useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useIcons from "../hooks/useIcons.js";

export default function Account() {
  const icons = useIcons();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { label: "Hồ sơ cá nhân", path: "info" },
    { label: "Đổi mật khẩu", path: "password" },
    { label: "Đơn hàng của tôi", path: "order" },
    { label: "Nhận xét của tôi", path: "review" },
    { label: "Sản phẩm yêu thích", path: "favorite" },
    { label: "Ví voucher", path: "voucher" }
  ];

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);
  if (!user || loading) return null;
  return (
    <div className="flex gap-6 mt-10 px-10 min-h-screen">
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
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg text-lg
                 ${isActive
                   ? "text-[#b74e3a] font-semibold bg-[#f5e9e5]"
                   : "text-gray-700 hover:bg-gray-100"
                 }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </ul>
      </div>
      {/* ========== RIGHT PANEL ==========  */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  );
}
