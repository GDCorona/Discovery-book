// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import Category from "./pages/Category";
import BookDetail from "./pages/BookDetail";
import CartPage from "./pages/CartPage";
import Account from "./pages/Account";
import Payment from "./pages/Payment";

import { useToast } from "./context/ToastContext";
export default function App() {
  const { toast, progress } = useToast();
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3f1] text-[#2b1f1a] pt-6">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* SEARCH RESULTS (query param) */}
          <Route path="/category" element={<Category />} />
          {/* CATEGORY BROWSE */}
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        </div>
        <Toast message={toast} progress={progress}/>
      </main>
      <Footer />
    </div>
  );
}
