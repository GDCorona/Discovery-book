import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OrderDetail() {
    const { user } = useAuth();
    const { orderId } = useParams();
    const navigate = useNavigate();

    const ORDER_KEY = `orders_${user.id}`;
    const orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
    const order = orders.find(o => o.id === orderId);

    const currency = (v) => v.toLocaleString("vi-VN") + " ₫";
    const ORDER_STEPS = [
        "Đã đặt",
        "Đang xử lý",
        "Đang vận chuyển",
        "Đã giao",
    ];
    const currentIndex = ORDER_STEPS.findIndex(
        (s) => s === order.status
    );
    const isLastStep = currentIndex === ORDER_STEPS.length - 1;
    if (!order) {
        return (
        <div className="p-10 text-center">
            <p className="text-gray-500">Không tìm thấy đơn hàng.</p>
            <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#b74e3a] hover:underline"
            >
            Quay lại
            </button>
        </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* ===== HEADER ===== */}
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
            {/* ===== STATUS ===== */}
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between">
                <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-semibold">{order.id}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p>{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                </div>
            </div>
            {/* ===== ORDER TIMELINE ===== */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold mb-6">Trạng thái đơn hàng</h2>
                <div className="flex items-center justify-between relative">
                    {ORDER_STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex || (isLastStep && index === currentIndex);
                    const isActive = index === currentIndex && !isLastStep;
                    return (
                        <div key={step} className="flex-1 text-center relative">
                            {/* Line */}
                            {index !== 0 && (
                                <div
                                className={`absolute top-4 left-0 w-full h-1 -z-10 ${
                                    isCompleted ? "bg-green-500" : "bg-gray-200"
                                }`}
                                />
                            )}
                            {/* Circle */}
                            <div
                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold
                                ${
                                    isCompleted
                                    ? "bg-green-500 text-white"
                                    : isActive
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-gray-600"
                                }
                                `}
                            >
                                {isCompleted ? "✓" : index + 1}
                            </div>
                            {/* Label */}
                            <p
                                className={`mt-2 text-sm ${
                                isActive
                                    ? "font-semibold text-blue-600"
                                    : isCompleted
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                            >
                                {step}
                            </p>
                        </div>
                    );
                    })}
                </div>
            </div>
            {/* ===== ITEMS ===== */}
            <div className="bg-white rounded-lg shadow divide-y">
                {order.items.map(item => (
                <div key={item.id} className="flex gap-4 p-4">
                    <img
                        src={item.cover || "https://via.placeholder.com/80x100"}
                        className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                        </p>
                    </div>
                    <div className="font-semibold">
                        {currency(item.price * item.quantity)}
                    </div>
                </div>
                ))}
            </div>
            {/* ===== PAYMENT SUMMARY ===== */}
            <div className="bg-white rounded-lg shadow p-6 space-y-3">
                <div className="flex justify-between">
                    <span>Tổng tiền hàng</span>
                    <span>{currency(order.total)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{currency(1000)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí bảo hiểm</span>
                    <span>{currency(789)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#b74e3a] pt-2 border-t">
                    <span>Thành tiền:</span>
                    <span>{currency(order.total)}</span>
                </div>
            </div>
            {/* ===== ACTIONS ===== */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                Quay lại
                </button>
                {order.status === "Đã giao" && (
                <button className="px-4 py-2 bg-[#4b2e2a] text-white rounded-lg">
                    Mua lại
                </button>
                )}
            </div>
        </div>
    );
}
