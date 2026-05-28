const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Beauty", "Toys", "Automotive"],
    },
    subcategory: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    specifications: {
      type: Map,
      of: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
productSchema.index({ name: "text", description: "text", tags: "text" })

// Additional query performance indexes
productSchema.index({ category: 1 })
productSchema.index({ featured: 1 })
productSchema.index({ isActive: 1 })

module.exports = mongoose.model("Product", productSchema)
