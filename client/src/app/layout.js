import { Toaster } from "react-hot-toast";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { SearchProvider } from "../context/SearchContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Alpha Tech",
  description: "Electronics Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" reverseOrder={false} />

        <AuthProvider>
          <SearchProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}