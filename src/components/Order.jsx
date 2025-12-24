import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
export default function Order() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const ORDER_KEY = `orders_${user.id}`;
    const orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
    const currency = (v) => v.toLocaleString("vi-VN") + " ₫";
    // ===== Order status =====
    const ORDER_STATUSES = [
        "Tất cả",
        "Đang xử lý",
        "Đang vận chuyển",
        "Đã giao",
        "Đã hủy",
    ];
    const STATUS_STYLE = {
        "Đang xử lý": "bg-yellow-100 text-yellow-700",
        "Đang vận chuyển": "bg-blue-100 text-blue-700",
        "Đã giao": "bg-green-100 text-green-700",
        "Đã hủy": "bg-red-100 text-red-700",
    };
    const [activeStatus, setActiveStatus] = useState("Tất cả");
    const filteredOrders = useMemo(() => {
        if (activeStatus === "Tất cả") return orders;
        return orders.filter(order => order.status === activeStatus);
    }, [orders, activeStatus]);
    // ===== Pagination =====
    const RESULTS_PER_PAGE = 2;
    const [page, setPage] = useState(1);
    useEffect(() => {
        setPage(1);
    }, [activeStatus]);
    const totalPages = Math.ceil(filteredOrders.length / RESULTS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * RESULTS_PER_PAGE;
        return filteredOrders.slice(start, start + RESULTS_PER_PAGE);
    }, [filteredOrders, page]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
            {/* ===== STATUS TABS ===== */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
            {ORDER_STATUSES.map(status => (
                <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition
                    ${
                    activeStatus === status
                        ? "bg-[#4b2e2a] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                `}
                >
                {status}
                </button>
            ))}
            </div>
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
                    <div className="space-y-5">
                    {paginatedOrders.map(order => (
                        <div key={order.id} className="rounded-xl p-4 bg-white shadow overflow-hidden border-gray-100">
                            {/* --- Order Header --- */}    
                            <div className="bg-gray-100 px-6 py-4 flex justify-between border-b">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mã đơn hàng</p>
                                    <p className="font-mono text-sm font-semibold">{order.id}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ngày đặt</p>
                                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${STATUS_STYLE[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>
                            {/* --- Order Items --- */}
                            <div className="divide-y divide-gray-100 px-6">        
                                {order.items.slice(0, 2).map((item) => (
                                    <div key={item.id} className="py-4 flex items-center gap-4">
                                        <img src={item.cover || "https://via.placeholder.com/60x80"} alt={item.title} 
                                            className="w-16 h-20 object-cover rounded shadow-sm"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">{currency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            {/* --- Order Footer --- */}
                            <div className="bg-white px-6 py-4 border-t flex justify-between items-center">
                                <div className="flex gap-3">
                                    <button onClick={() => navigate(`/account/orders/${order.id}`)} 
                                    className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition">
                                        Chi tiết đơn hàng
                                    </button>
                                    {(order.status === "Đã giao" || order.status === "Đã hủy") && (
                                        <button className="px-4 py-2 text-sm bg-[#4b2e2a] text-white rounded-lg hover:bg-[#6b4f45] transition">
                                        Mua lại
                                        </button>
                                    )}
                                    {(order.status === "Đang xử lý" || order.status === "Đang vận chuyển") && (
                                        <button className="px-4 py-2 text-sm bg-[#4b2e2a] text-white rounded-lg hover:bg-[#6b4f45] transition">
                                        Hủy đơn
                                        </button>
                                    )}
                                </div>
                                <div className="text-right font-bold mt-2">
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
