"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const InventoryAlerts = () => {
  const [alerts, setAlerts] = useState({
    lowStock: [],
    outOfStock: [],
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchInventoryAlerts();
  }, []);

  const fetchInventoryAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/analytics/dashboard");

      if (response.status === 200) {
        const data = response.data;
        setAlerts({
          lowStock: data.lowStockProducts || [],
          outOfStock: data.overview.outOfStockCount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching inventory alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Inventory Alerts</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Out of Stock Alert */}
        {alerts.outOfStock > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  {alerts.outOfStock} products are out of stock
                </h4>
                <p className="text-sm text-red-700">
                  These products need immediate restocking to avoid lost sales.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {alerts.lowStock.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-yellow-800">
                  {alerts.lowStock.length} products are running low on stock
                </h4>
                <div className="mt-2 space-y-2">
                  {alerts.lowStock.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-yellow-700">{product.name}</span>
                      <span className="font-medium text-yellow-800">
                        {product.stock} left
                      </span>
                    </div>
                  ))}
                  {alerts.lowStock.length > 5 && (
                    <p className="text-sm text-yellow-700">
                      ...and {alerts.lowStock.length - 5} more products
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Alerts */}
        {alerts.outOfStock === 0 && alerts.lowStock.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">
                  All products are well stocked
                </h4>
                <p className="text-sm text-green-700">
                  No immediate inventory action required.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryAlerts;
