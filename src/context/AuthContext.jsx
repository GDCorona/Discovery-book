import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Get user
  const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
  // Load saved user
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false); // DONE loading
  }, []);

  // Save user
  const saveUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  // ----------------------
  // LOGIN (username OR email)
  // ----------------------
  const login = (identifier, password) => {
    const users = getUsers();

    if (users.length === 0)
      return { success: false, msg: "Chưa có tài khoản nào!" };

    // Find user by username OR email
    const user = users.find(
      (u) => u.username === identifier || u.email === identifier
    );
    if (!user)
      return { success: false, field: "username", msg: "Tài khoản không tồn tại." };

    if (user.password !== password)
      return { success: false, field: "password", msg: "Mật khẩu không đúng." };
    // Save logged-in user
    saveUser(user);
    return { success: true };
  };

  // ----------------------
  // LOGOUT
  // ----------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ----------------------
  // REGISTER NEW ACCOUNT
  // ----------------------
  const register = (newUser) => {
    const users = getUsers();

    if (users.some((u) => u.username === newUser.username)) {
      return { success: false, field: "username", msg: "Tên đăng nhập đã tồn tại!" };
    }

    if (users.some((u) => u.email === newUser.email)) {
      return { success: false, field: "email", msg: "Email đã được sử dụng!" };
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, msg: "Tạo tài khoản thành công!" };
  };


  // ----------------------
  // UPDATE ACCOUNT INFO
  // ----------------------
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    // update local "user"
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);

    // update inside "users" array
    const users = getUsers();
    const idx = users.findIndex((u) => u.username === user.username);

    if (idx !== -1) {
      users[idx] = updated;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };
  const changePassword = (oldPass, newPass) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.username === user.username);
    // user not found (shouldn't happen)
    if (idx === -1) {
      return { success: false, msg: "Không tìm thấy tài khoản!" };
    }

    // wrong old password
    if (users[idx].password !== oldPass) {
      return { success: false, msg: "Mật khẩu cũ không đúng!" };
    }

    // update password
    users[idx].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    // update current logged-in user too
    setUser(users[idx]);
    localStorage.setItem("user", JSON.stringify(users[idx]));

    return { success: true, msg: "Đổi mật khẩu thành công!" };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, updateUser, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
