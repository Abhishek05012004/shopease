"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { ordersAPI } from "../services/api";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: "India",
    },
  });

  const { data: ordersRes } = useQuery("userOrders", ordersAPI.getOrders);
  const orders = ordersRes?.data || [];
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameTrimmed = (formData.name || "").trim();
    const emailTrimmed = (formData.email || "").trim();
    const phoneTrimmed = (formData.phone || "").trim();
    const zipCodeTrimmed = (formData.address?.zipCode || "").trim();

    if (!nameTrimmed) {
      toast.error("Name is required.");
      return;
    }

    if (!emailTrimmed) {
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!phoneTrimmed) {
      toast.error("Phone number is required.");
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneTrimmed)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!zipCodeTrimmed) {
      toast.error("Postal code is required.");
      return;
    }
    const postalCodeRegex = /^\d{6}$/;
    if (!postalCodeRegex.test(zipCodeTrimmed)) {
      toast.error("Postal code must be exactly 6 digits (numbers only).");
      return;
    }

    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zipCode: user?.address?.zipCode || "",
        country: "India",
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-slate-800 font-bold text-lg sm:text-xl">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                    {user?.name}
                  </h1>
                  <p className="text-gray-300 text-xs sm:text-sm truncate">{user?.email}</p>
                  {user?.role === "admin" && (
                    <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-yellow-500 text-slate-800">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  className="flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg border border-slate-500 transition-colors w-full sm:w-auto"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-semibold text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h2>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-9 pr-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-9 pr-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                        placeholder="Enter your 10-digit phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-semibold text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </h2>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-slate-800 disabled:text-gray-400"
                        placeholder="6-digit ZIP Code"
                      />
                    </div>
                     <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value="India"
                        disabled
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-750 rounded-lg text-sm text-gray-450 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-slate-600">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg border border-slate-500 transition-colors flex items-center justify-center text-xs sm:text-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Account Status
            </h3>
            <p className="text-emerald-400 font-medium text-sm sm:text-base">Active</p>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Member since {new Date(user?.createdAt).getFullYear()}
            </p>
          </div>

          <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Total Orders
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-500">{totalOrders}</p>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">Lifetime orders</p>
          </div>

          <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Total Spent
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-500">₹{totalSpent.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">Lifetime spending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
