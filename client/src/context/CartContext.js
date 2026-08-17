"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load Cart
  useEffect(() => {
    const savedCart = localStorage.getItem("alpha-tech-cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save Cart
  useEffect(() => {
    localStorage.setItem(
      "alpha-tech-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add To Cart
  const addToCart = (product) => {
    const existing = cartItems.find(
      (item) => item._id === product._id
    );

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

      toast.success("Quantity Updated");
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);

      toast.success("Added To Cart");
    }
  };

  // Increase Quantity
  const increaseQty = (_id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === _id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease Quantity
  const decreaseQty = (_id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item._id === _id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove Item
  const removeItem = (_id) => {
    setCartItems(
      cartItems.filter((item) => item._id !== _id)
    );

    toast.success("Product Removed");
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("alpha-tech-cart");

    toast.success("Cart Cleared");
  };

  // ==========================
  // Price Calculations
  // ==========================

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCharge =
    totalPrice > 1000 ? 0 : 99;

  const gst = Math.round(totalPrice * 0.18);

  const grandTotal =
    totalPrice + gst + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        totalPrice,
        deliveryCharge,
        gst,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);