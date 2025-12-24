import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import useIcons from "../hooks/useIcons";
export default function CartPage() {
  const icons = useIcons();
  const { cart, removeFromCart, totalItems, totalPrice, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected = cart.length > 0 && selectedIds.length === cart.length;
  //toggle select all items
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map(item => item.id));
    }
  };
  //toggle select 1 item
  const toggleSelectItem = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };
  //selected items
  const selectedItems = cart.filter(item => selectedIds.includes(item.id));
  const selectedTotalPrice = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [selectedItems]);
  //delete selected items
  const deleteSelected = () => {
    selectedIds.forEach(id => removeFromCart(id));
    setSelectedIds([]);
  };
  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Giỏ hàng của bạn 
        <span className="text-gray-500 text-xl font-normal"> ({totalItems} sản phẩm)</span>
      </h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Giỏ hàng đang trống.</p>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex justify-between gap-4 bg-white shadow rounded-md text-base font-medium mb-3 p-4">
            <div className="w-[60%] flex items-center gap-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded"
              />
              <span > Chọn tất cả ({totalItems} sản phẩm)</span>
            </div>      
            <div className="w-[10%] text-center">Số lượng</div>
            <div className="w-[10%] text-center">Thành tiền</div>
            <div>
              <button
                disabled={selectedIds.length === 0}
                onClick={deleteSelected}
                title="Xoá tất cả"    
              >
                <img src={icons.recycleBin1} className="w-5 h-5"/>
              </button>
            </div> 
          </div>
          {/* ITEMS */}
          <div className="space-y-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex gap-4 items-center justify-between p-4 bg-white shadow rounded-lg"
              >
                <div className="w-[60%] flex items-center gap-5">
                  {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 rounded"
                    />
                  {/* Image */}
                  <Link to={`/book/${item.id}`}>
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded cursor-pointer"
                    />
                  </Link>
                  {/* Product info */}
                  <Link to={`/book/${item.id}`}>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.price.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </Link>
                </div>
                {/* Quantity */}
                <div className="w-[10%] flex justify-between items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                {/*Total price*/}
                <div className="w-[10%] text-center font-semibold text-[#b74e3a]">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                </div>
                {/* Delete */}
                <div>
                  <button
                    onClick={() => removeFromCart(item.id)
                    }
                  >
                    <img src={icons.recycleBin1} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Total */}
            <div className="text-right text-xl font-bold mt-4">
              Tổng cộng:{" "}
              <span className="text-[#4b2e2a]">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="w-full mt-4 py-4 bg-[#4b2e2a] text-white text-lg rounded-lg hover:bg-[#6b4f45]"
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}
