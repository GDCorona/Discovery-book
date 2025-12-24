import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Pagination from "../components/Pagination";

export default function Order() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const ORDER_KEY = `orders_${user.id}`;
  const orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || [];

  const currency = (v) => v.toLocaleString("vi-VN") + " ₫";

  // ===== Pagination state =====
  const RESULTS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(orders.length / RESULTS_PER_PAGE);

  // Paginated orders (IMPORTANT)
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * RESULTS_PER_PAGE;
    return orders.slice(start, start + RESULTS_PER_PAGE);
  }, [orders, page]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-[#b74e3a] font-semibold hover:underline"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          {/* ===== ORDER LIST ===== */}
          <div className="space-y-8">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white shadow border overflow-hidden"
              >
                {/* --- Order Header --- */}
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Mã đơn hàng
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {order.id}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Ngày đặt
                    </p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold
                      ${order.status === "Đang xử lý" && "bg-yellow-100 text-yellow-700"}
                      ${order.status === "Đang vận chuyển" && "bg-blue-100 text-blue-700"}
                      ${order.status === "Đã giao" && "bg-green-100 text-green-700"}
                    `}
                  >
                    {order.status}
                  </span>
                </div>

                {/* --- Order Items (summary view) --- */}
                <div className="px-6 divide-y">
                  {order.items.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex items-center gap-4"
                    >
                      <img
                        src={item.cover || "https://via.placeholder.com/60x80"}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded shadow-sm"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {currency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}

                  {/* Show “more items” indicator */}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500 py-3">
                      + {order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* --- Order Footer --- */}
                <div className="px-6 py-4 border-t flex justify-between items-center">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                      Chi tiết đơn hàng
                    </button>

                    {order.status === "Đã giao" && (
                      <button className="px-4 py-2 text-sm bg-[#4b2e2a] text-white rounded-lg hover:bg-[#6b4f45]">
                        Mua lại
                      </button>
                    )}
                  </div>

                  <div className="text-right font-bold">
                    <span className="text-gray-600 mr-2">Tổng:</span>
                    <span className="text-xl text-[#b74e3a]">
                      {currency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
