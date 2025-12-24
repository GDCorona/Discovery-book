import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import Category from "./pages/Category";
import BookDetail from "./pages/BookDetail";
import CartPage from "./pages/CartPage";
import Payment from "./pages/Payment";
import Account from "./pages/Account";
import AccountInfo from "./components/AccountInfo";
import ChangePassword from "./components/ChangePassword";
import Favorite from "./components/Favorite";
import Order from "./components/Order";
import OrderDetail from "./components/OrderDetail";
import Review from "./components/Review";
import Voucher from "./components/Voucher";
import { useToast } from "./context/ToastContext";
export default function App() {
  const { toast, progress } = useToast();
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3f1] text-[#2b1f1a] pt-6">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto w-full px-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* SEARCH RESULTS (query param) */}
          <Route path="/category" element={<Category />} />
          {/* CATEGORY BROWSE */}
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<Account />}>
            <Route index element={<AccountInfo />} />
            <Route path="info" element={<AccountInfo />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="favorite" element={<Favorite />} />
            <Route path="order" element={<Order />} />
            <Route path="/account/orders/:orderId" element={<OrderDetail />} />
            <Route path="review" element={<Review />} />
            <Route path="voucher" element={<Voucher />} />
          </Route>
          <Route path="/payment" element={<Payment />} />
        </Routes>
        </div>
        <Toast message={toast} progress={progress}/>
      </main>
      <Footer />
    </div>
  );
}
