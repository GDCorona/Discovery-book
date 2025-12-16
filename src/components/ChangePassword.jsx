import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { user, updateUser } = useAuth();

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const err = {};
    if (oldPw !== user.password) {
      err.oldPw = "Mật khẩu hiện tại không chính xác!";
    }
    if (!/\d/.test(newPw) || !/[a-zA-Z]/.test(newPw)) {
      err.newPw = "Mật khẩu mới phải có cả chữ và số.";
    }
    if (newPw.length < 6) {
      err.newPw = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    }
    if (newPw !== confirmPw) {
      err.confirmPw = "Mật khẩu xác nhận không khớp!";
    }

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    // Update password
    updateUser({ password: newPw });
    alert("Đổi mật khẩu thành công!");

    setOldPw("");
    setNewPw("");
    setConfirmPw("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đổi mật khẩu</h1>

      {/* OLD PASSWORD */}
      <label className="block mb-4">
        <span className="font-medium">Mật khẩu hiện tại</span>
        <input
          type="password"
          placeholder="Mật khẩu hiện tại"
          className={`w-full border p-2 rounded mt-1 ${
            errors.oldPw ? "border-red-500" : ""
          }`}
          value={oldPw}
          onChange={(e) => setOldPw(e.target.value)}
        />
        {errors.oldPw && (
          <p className="text-red-500 text-sm mt-1">{errors.oldPw}</p>
        )}
      </label>

      {/* NEW PASSWORD */}
      <label className="block mb-4">
        <span className="font-medium">Mật khẩu mới</span>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          className={`w-full border p-2 rounded mt-1 ${
            errors.newPw ? "border-red-500" : ""
          }`}
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
        />
        {errors.newPw && (
          <p className="text-red-500 text-sm mt-1">{errors.newPw}</p>
        )}
      </label>

      {/* CONFIRM PASSWORD */}
      <label className="block mb-4">
        <span className="font-medium">Nhập lại mật khẩu mới</span>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          className={`w-full border p-2 rounded mt-1 ${
            errors.confirmPw ? "border-red-500" : ""
          }`}
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
        />
        {errors.confirmPw && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPw}</p>
        )}
      </label>

      <button
        onClick={handleSave}
        className="mx-auto block mt-4 px-6 py-2 bg-[#b74e3a] text-white rounded hover:bg-[#9d3c2e]"
      >
        Lưu thay đổi
      </button>
    </div>
  );
}
