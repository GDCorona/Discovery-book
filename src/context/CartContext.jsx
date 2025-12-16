import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext();
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const isInCart = (id) => cart.some(item => item.id === id);
  /* ------------------ TOAST ------------------ */
  const {showToast} = useToast(); //show added to cart pop up

  /* ------------------ Add item to cart ------------------ */
  const addToCart = (book, qty = 1, show = true) => {
    setCart((prev) => {
      // If book exists, increase quantity
      const exists = prev.find((item) => item.id === book.id);
      if (exists) {
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      // Otherwise add new book
      return [...prev, { ...book, quantity: qty }];
    });
    // Only show toast when needed
    if (show) {
      showToast("Đã thêm vào giỏ hàng!");
    }
  };
  /* ------------------ Remove item from cart ------------------ */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* ------------------ Update quantity ------------------ */
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  const totalItems = cart.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  return (
      <CartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
          updateQuantity,
          totalItems,
          totalPrice,
          isInCart
        }}
      >
        {children}
      </CartContext.Provider>
    );
}

export function useCart() {
  return useContext(CartContext);
}
