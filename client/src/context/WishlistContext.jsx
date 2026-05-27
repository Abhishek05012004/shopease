"use client";

import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { wishlistAPI } from "../services/api";
import toast from "react-hot-toast";

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_WISHLIST":
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
    case "CLEAR_WISHLIST":
      return {
        ...state,
        items: [],
        loading: false,
      };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    loading: false,
  });

  const { isAuthenticated, user } = useAuth();
  const processingRef = useRef(new Set());

  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated && user) {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await wishlistAPI.getWishlist();
          dispatch({ type: "SET_WISHLIST", payload: response.data });
        } catch (error) {
          console.error("Failed to load wishlist:", error);
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadWishlist();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_WISHLIST" });
    }
  }, [isAuthenticated]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return false;
    }

    if (processingRef.current.has(product._id)) {
      return false;
    }
    processingRef.current.add(product._id);

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistAPI.addToWishlist(product._id);
      dispatch({ type: "SET_WISHLIST", payload: response.data });
      toast.success("Product added to wishlist!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add item to wishlist";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    } finally {
      processingRef.current.delete(product._id);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      return false;
    }

    if (processingRef.current.has(productId)) {
      return false;
    }
    processingRef.current.add(productId);

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await wishlistAPI.removeFromWishlist(productId);
      dispatch({ type: "SET_WISHLIST", payload: response.data });
      toast.success("Product removed from wishlist!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to remove item from wishlist";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    } finally {
      processingRef.current.delete(productId);
    }
  };

  const isInWishlist = (productId) => {
    return state.items.some((item) => item._id === productId);
  };

  const value = {
    items: state.items,
    loading: state.loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isAuthenticated,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
