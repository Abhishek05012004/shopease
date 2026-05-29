import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cartAPI } from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items || [],
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        loading: false,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
  });

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await cartAPI.getCart();
          dispatch({ type: "SET_CART", payload: response.data });
        } catch (error) {
          console.error("Failed to load cart:", error);
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return false;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartAPI.addToCart(product._id, quantity);
      dispatch({ type: "SET_CART", payload: response.data });
      toast.success("Product added to cart!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add item to cart";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your cart");
      return false;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartAPI.removeFromCart(productId);
      dispatch({ type: "SET_CART", payload: response.data });
      toast.success("Product removed from cart!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to remove item from cart";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your cart");
      return false;
    }

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartAPI.updateCartItem(productId, quantity);
      dispatch({ type: "SET_CART", payload: response.data });
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update item quantity";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your cart");
      return false;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartAPI.clearCart();
      dispatch({ type: "SET_CART", payload: response.data });
      toast.success("Cart cleared!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to clear cart";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const getCartTotal = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return state.items.length;
  };

  const isInCart = (productId) => {
    return state.items.some((item) => {
      const itemProductId = typeof item.product === "object" ? item.product?._id : item.product;
      return (itemProductId || item._id) === productId;
    });
  };

  const value = {
    items: state.items,
    loading: state.loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    isAuthenticated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
