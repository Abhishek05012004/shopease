"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../../services/api";

const ProductRecommendations = ({ productId, type = "related" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        let url = "";

        switch (type) {
          case "related":
            url = `/recommendations/${productId}`;
            break;
          case "bought-together":
            url = `/recommendations/bought-together/${productId}`;
            break;
          case "trending":
            url = `/recommendations/trending`;
            break;
          default:
            url = `/recommendations/${productId}`;
        }
        const response = await api.get(url);
        if (response.status === 200) {
          setRecommendations(response.data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId || type === "trending") {
      fetchRecommendations();
    }
  }, [productId, type]);

  const getTitle = () => {
    switch (type) {
      case "related":
        return "Related Products";
      case "bought-together":
        return "Frequently Bought Together";
      case "trending":
        return "Trending Now";
      default:
        return "Recommended Products";
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-6">{getTitle()}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-6">{getTitle()}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {type === "trending" && recommendations.length >= 8 && (
        <div className="text-center mt-6">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;
