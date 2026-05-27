"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: !!localStorage.getItem("token"),
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Found stored token, verifying...");
      // Verify token and get user profile
      authAPI
        .getProfile()
        .then((response) => {
          console.log("Token verification successful:", response.data.email);
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { ...response.data, token },
          });
        })
        .catch((error) => {
          console.log(
            "Token verification failed:",
            error.response?.data?.message
          );
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      dispatch({ type: "LOGIN_START" });
      const response = await authAPI.login(email, password);

      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      toast.success("Login successful!");

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      toast.error(message);
      throw error;
    }
  };

  const register = async (name, email, password, otp) => {
    try {
      console.log("Attempting registration for:", email);
      dispatch({ type: "LOGIN_START" });
      const response = await authAPI.register(name, email, password, otp);

      console.log("Registration successful:", response.data);
      localStorage.setItem("token", response.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      toast.success("Registration successful!");

      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({ type: "UPDATE_PROFILE", payload: response.data });
      toast.success("Profile updated successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
