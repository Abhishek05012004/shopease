"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  X,
  Save,
  Eye,
  AlertTriangle,
  Package,
  ImageIcon,
} from "lucide-react";
import { productsAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
    featured: false,
    isActive: true,
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("adminProducts", () =>
    productsAPI.getProducts({ limit: 1000 })
  );

  const deleteProductMutation = useMutation(productsAPI.deleteProduct, {
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries("adminProducts");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });

  const createProductMutation = useMutation(productsAPI.createProduct, {
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries("adminProducts");
      setShowAddModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });

  const updateProductMutation = useMutation(
    ({ productId, productData }) =>
      productsAPI.updateProduct(productId, productData),
    {
      onSuccess: () => {
        toast.success("Product updated successfully!");
        queryClient.invalidateQueries("adminProducts");
        setEditingProduct(null);
        setShowProductModal(false);
        setShowAddModal(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update product");
      },
    }
  );

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: [],
      featured: false,
      isActive: true,
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images || [],
      featured: product.featured || false,
      isActive: product.isActive !== false,
    });
    setShowProductModal(false); // Close view details if editing from view modal
    setShowAddModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();

    const productData = {
      ...productForm,
      price: Number.parseFloat(productForm.price),
      stock: Number.parseInt(productForm.stock),
    };

    if (editingProduct) {
      updateProductMutation.mutate({
        productId: editingProduct._id,
        productData,
      });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setProductForm((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: imageUrlInput.trim(),
            alt: `Product image ${prev.images.length + 1}`,
          },
        ],
      }));
      setImageUrlInput("");
    } else {
      toast.error("Please enter a valid image URL");
    }
  };

  const removeImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const filteredProducts = data?.data?.products?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Beauty",
    "Toys",
    "Automotive",
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-slate-300 mt-2">
            Manage your product inventory, pricing, and details
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowAddModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters (Dark Slate Theme) */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Products Table (Dark Slate Theme) */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Category & Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Inventory Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Images & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredProducts?.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={
                            product.images?.[0]?.url ||
                            `/placeholder.svg?height=60&width=60&query=${product.name}`
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-600"
                        />
                        {product.images?.length > 1 && (
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {product.images.length}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white max-w-xs truncate">
                          {product.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          ID: {product._id.slice(-8)}
                        </div>
                        {product.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-700 mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700">
                        {product.category}
                      </span>
                      <div className="text-lg font-semibold text-white">
                        ₹{product.price}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          product.stock > 10
                            ? "bg-green-900/30 text-green-300 border border-green-700"
                            : product.stock > 0
                            ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700"
                            : "bg-red-900/30 text-red-300 border border-red-700"
                        }`}
                      >
                        <Package className="h-3 w-3 mr-1" />
                        {product.stock} units
                      </span>
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="flex items-center text-xs text-yellow-400">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low Stock
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-slate-400">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {product.images?.length || 0} images
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          product.isActive
                            ? "bg-green-900/30 text-green-300 border border-green-700"
                            : "bg-slate-700 text-slate-300 border border-slate-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-slate-700 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-700 transition-colors"
                        disabled={deleteProductMutation.isLoading}
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats (Dark Mode Cards) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-300">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {data?.data?.totalProducts || 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-300">In Stock</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {filteredProducts?.filter((p) => p.stock > 0).length || 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-300">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">
            {filteredProducts?.filter((p) => p.stock === 0).length || 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-300">Featured</h3>
          <p className="text-3xl font-bold text-purple-400 mt-2">
            {filteredProducts?.filter((p) => p.featured).length || 0}
          </p>
        </div>
      </div>

      {/* Modal - Add / Edit Product (Dark Slate Theme) */}
      {(showAddModal || (showProductModal && editingProduct)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowProductModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Product Images
                </label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 rounded-lg transition-colors"
                    >
                      Add URL
                    </button>
                  </div>

                  {productForm.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {productForm.images.map((image, index) => (
                        <div key={image.url} className="relative group">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt}
                            onClick={() => {
                              if (index > 0) {
                                setProductForm((prev) => {
                                  const updated = [...prev.images];
                                  const [selected] = updated.splice(index, 1);
                                  updated.unshift(selected);
                                  return { ...prev, images: updated };
                                });
                              }
                            }}
                            className={`w-full h-24 object-cover rounded-lg border transition-all ${
                              index === 0
                                ? "border-yellow-500 ring-2 ring-yellow-500/50"
                                : "border-slate-600 cursor-pointer hover:border-yellow-400"
                            }`}
                          />
                          {index === 0 ? (
                            <span className="absolute bottom-1 left-1 bg-yellow-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                              Main
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm((prev) => {
                                  const updated = [...prev.images];
                                  const [selected] = updated.splice(index, 1);
                                  updated.unshift(selected); // move to first position
                                  return { ...prev, images: updated };
                                });
                              }}
                              className="absolute bottom-1 left-1 bg-slate-800/90 hover:bg-yellow-500 hover:text-slate-900 text-[10px] text-white font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Set Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-600 text-yellow-500 focus:ring-yellow-500 bg-slate-700"
                  />
                  <span className="ml-2 text-sm text-slate-300">
                    Featured Product
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-600 text-yellow-500 focus:ring-yellow-500 bg-slate-700"
                  />
                  <span className="ml-2 text-sm text-slate-300">
                    Active Product
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowProductModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createProductMutation.isLoading ||
                    updateProductMutation.isLoading
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - View Product Details (Dark Slate Theme) */}
      {showProductModal && selectedProduct && !editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Product Details
                </h2>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    {selectedProduct.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-slate-400">
                        Category:
                      </span>
                      <span className="ml-2 text-sm text-white">
                        {selectedProduct.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-400">
                        Price:
                      </span>
                      <span className="ml-2 text-lg font-semibold text-yellow-500">
                        ₹{selectedProduct.price}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-400">
                        Stock:
                      </span>
                      <span className="ml-2 text-sm text-white">
                        {selectedProduct.stock} units
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-400">
                        Status:
                      </span>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          selectedProduct.isActive
                            ? "bg-green-900/30 text-green-300 border border-green-700"
                            : "bg-slate-700 text-slate-300 border border-slate-600"
                        }`}
                      >
                        {selectedProduct.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-3">
                    Product Images
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-24 object-cover rounded-lg border border-slate-600"
                      />
                    )) || (
                      <div className="col-span-2 flex items-center justify-center h-24 bg-slate-700 rounded-lg border border-slate-600">
                        <span className="text-slate-400 text-sm">No images</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-slate-300">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                <button
                  onClick={() => handleEditProduct(selectedProduct)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
