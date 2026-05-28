const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals and deduplicate items before saving
cartSchema.pre("save", function (next) {
  // Deduplicate items
  const uniqueItems = [];
  const seen = new Set();
  for (const item of this.items) {
    const itemProductId = item.product && item.product._id 
      ? item.product._id.toString() 
      : item.product.toString();
    if (seen.has(itemProductId)) {
      const existing = uniqueItems.find(u => {
        const uId = u.product && u.product._id ? u.product._id.toString() : u.product.toString();
        return uId === itemProductId;
      });
      if (existing) {
        existing.quantity += item.quantity;
      }
    } else {
      seen.add(itemProductId);
      uniqueItems.push(item);
    }
  }
  this.items = uniqueItems;

  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
