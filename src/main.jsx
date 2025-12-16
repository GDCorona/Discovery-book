import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavProvider } from "./context/FavContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
      <CartProvider>
        <FavProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </FavProvider>
      </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
