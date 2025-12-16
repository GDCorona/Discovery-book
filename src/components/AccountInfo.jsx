import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import useIcons from "../hooks/useIcons.js";
export default function AccountInfo() {
  const icons = useIcons();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    fullname: user?.fullname || "",
    email: user?.email || "",
    gender: user?.gender || "",
    birthday: user?.birthday || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "" 
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
    setSuccessMsg("");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveAvatar = () => {
    setForm((prev) => ({ ...prev, avatar: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Tên không được để trống.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Email không hợp lệ.";

    const phoneRegex = /^[0-9]{9,11}$/;
    if (form.phone && !phoneRegex.test(form.phone))
      newErrors.phone = "Số điện thoại không hợp lệ.";

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateUser(form);
    setSuccessMsg("Cập nhật thông tin thành công!");
  };

  return (
    <div>
      {/* ========= AVATAR SECTION ========= */}
      <div className="flex flex-col items-center gap-3 mb-6">
        {/* Avatar wrapper with hover effect */}
        <div className="relative group w-36 h-36 rounded-full overflow-hidden border">
          {/* Avatar Image */}
          <img
            src={form.avatar || icons.account}
            alt="avatar"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition duration-300"></div>
          {/* Camera Icon fades in */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <img src={icons.camera} alt="edit" className="w-10 h-10" />
          </div>
          {/* Hidden upload input */}
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          {/* Clickable overlay to trigger upload */}
          <label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer"></label>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => document.getElementById("avatar-upload").click()} 
            className="text-sm text-blue-500 hover:underline" > Đổi ảnh 
          </button>
          <button onClick={handleRemoveAvatar} className="text-sm text-red-500 hover:underline">Xóa ảnh</button>
        </div>
      </div>

      {/* ========= INFO SECTION ========= */}      
      <h1 className="text-xl font-bold mb-5">Hồ sơ cá nhân</h1>

      {successMsg && (
        <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">
          {successMsg}
        </div>
      )}

      {/* Username */}
      <label className="block mb-4">
        <span className="font-medium">Tên đăng nhập</span>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className={`w-full p-3 border rounded mt-1 ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        <p className="text-red-500 text-sm">{errors.username}</p>
      </label>
      {/* Fullname */}
      <label className="block mb-4">
        <span className="font-medium">Họ và tên</span>
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          className={`w-full p-3 border rounded mt-1 ${
            errors.fullname ? "border-red-500" : ""
          }`}
        />
        <p className="text-red-500 text-sm">{errors.fullname}</p>
      </label>
      {/* Email */}
      <label className="block mb-4">
        <span className="font-medium">Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full p-3 border rounded mt-1 ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        <p className="text-red-500 text-sm">{errors.email}</p>
      </label>

      {/* Gender */}
      <label className="block mb-4">
        <span className="font-medium">Giới tính</span>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded mt-1"
        >
          <option value="">— Chọn giới tính —</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </label>

      {/* Birthday */}
      <label className="block mb-4">
        <span className="font-medium">Ngày sinh</span>
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          className="w-full p-3 border rounded mt-1"
        />
      </label>

      {/* Phone */}
      <label className="block mb-4">
        <span className="font-medium">Số điện thoại</span>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Thêm số điện thoại"
          className={`w-full p-3 border rounded mt-1 ${
            errors.phone ? "border-red-500" : ""
          }`}
        />
        <p className="text-red-500 text-sm">{errors.phone}</p>
      </label>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#b74e3a] text-white rounded-lg hover:bg-[#9d3c2e]"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
