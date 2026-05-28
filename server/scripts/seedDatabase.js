const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
require("dotenv").config({ path: "./.env" });

// Sample users data
const users = [
  {
    name: "Admin User",
    email: "admin@shopease.com",
    password: "admin123",
    role: "admin",
    phone: "9876543210",
    address: {
      street: "Ajwa Chowkdi",
      city: "Vadodara",
      state: "Gujarat",
      zipCode: "390001",
      country: "India",
    },
  },
];

// Sample products data with Unsplash images
const products = [
  // Electronics
  {
    name: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone yet with titanium design, A17 Pro chip, and professional camera system.",
    price: 95920,
    originalPrice: 103920,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        alt: "iPhone 15 Pro Max",
      },
    ],
    stock: 50,
    rating: 1,
    numReviews: 245,
    featured: true,
    tags: ["smartphone", "apple", "premium", "camera"],
    specifications: new Map([
      ["Display", "6.7-inch Super Retina XDR"],
      ["Chip", "A17 Pro"],
      ["Storage", "256GB"],
      ["Camera", "48MP Main + 12MP Ultra Wide + 12MP Telephoto"],
    ]),
  },
  {
    name: "MacBook Pro 16-inch",
    description:
      "Supercharged by M3 Pro and M3 Max chips. Built for all the ways you work.",
    price: 199920,
    originalPrice: 215920,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
        alt: "MacBook Pro",
      },
    ],
    stock: 25,
    rating: 4.9,
    numReviews: 189,
    featured: true,
    tags: ["laptop", "apple", "professional", "performance"],
    specifications: new Map([
      ["Processor", "Apple M3 Pro"],
      ["Memory", "18GB Unified Memory"],
      ["Storage", "512GB SSD"],
      ["Display", "16.2-inch Liquid Retina XDR"],
    ]),
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling with exceptional sound quality and all-day comfort.",
    price: 31920,
    originalPrice: 35920,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        alt: "Sony Headphones",
      },
    ],
    stock: 75,
    rating: 3,
    numReviews: 312,
    featured: false,
    tags: ["headphones", "wireless", "noise-canceling", "premium"],
    specifications: new Map([
      ["Type", "Over-ear Wireless"],
      ["Battery Life", "30 hours"],
      ["Noise Canceling", "Yes"],
      ["Connectivity", "Bluetooth 5.2"],
    ]),
  },
  {
    name: 'Samsung 65" QLED 4K TV',
    description:
      "Quantum Dot technology delivers brilliant colors and exceptional contrast.",
    price: 103920,
    originalPrice: 119920,
    category: "Electronics",
    subcategory: "TVs",
    brand: "Samsung",
    images: [
      {
        url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
        alt: "Samsung QLED TV",
      },
    ],
    stock: 15,
    rating: 2.4,
    numReviews: 156,
    featured: true,
    tags: ["tv", "4k", "smart-tv", "entertainment"],
    specifications: new Map([
      ["Screen Size", "65 inches"],
      ["Resolution", "4K UHD (3840 x 2160)"],
      ["Technology", "QLED"],
      ["Smart Platform", "Tizen OS"],
    ]),
  },

  // Clothing
  {
    name: "Premium Cotton T-Shirt",
    description:
      "Soft, comfortable, and stylish cotton t-shirt perfect for everyday wear.",
    price: 299,
    originalPrice: 399,
    category: "Clothing",
    subcategory: "T-Shirts",
    brand: "ComfortWear",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Cotton T-Shirt",
      },
    ],
    stock: 100,
    rating: 4.4,
    numReviews: 89,
    featured: false,
    tags: ["t-shirt", "cotton", "casual", "comfortable"],
    specifications: new Map([
      ["Material", "100% Cotton"],
      ["Fit", "Regular"],
      ["Care", "Machine Washable"],
      ["Sizes", "XS-XXL"],
    ]),
  },
  {
    name: "Designer Denim Jacket",
    description:
      "Classic denim jacket with modern styling and premium construction.",
    price: 7120,
    originalPrice: 9520,
    category: "Clothing",
    subcategory: "Jackets",
    brand: "UrbanStyle",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
        alt: "Denim Jacket",
      },
    ],
    stock: 45,
    rating: 3.5,
    numReviews: 67,
    featured: false,
    tags: ["jacket", "denim", "casual", "fashion"],
    specifications: new Map([
      ["Material", "Premium Denim"],
      ["Style", "Classic Fit"],
      ["Pockets", "4 Functional Pockets"],
      ["Closure", "Button Front"],
    ]),
  },
  {
    name: "Athletic Running Shoes",
    description:
      "High-performance running shoes with advanced cushioning and breathable design.",
    price: 10320,
    originalPrice: 12720,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "SportMax",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        alt: "Running Shoes",
      },
    ],
    stock: 60,
    rating: 4.7,
    numReviews: 203,
    featured: true,
    tags: ["shoes", "running", "athletic", "comfortable"],
    specifications: new Map([
      ["Type", "Running Shoes"],
      ["Cushioning", "Advanced Foam"],
      ["Upper", "Breathable Mesh"],
      ["Sole", "Rubber Outsole"],
    ]),
  },

  // Books
  {
    name: "The Art of Programming",
    description:
      "Comprehensive guide to modern programming techniques and best practices.",
    price: 399,
    originalPrice: 499,
    category: "Books",
    subcategory: "Technology",
    brand: "TechPress",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
        alt: "Programming Book",
      },
    ],
    stock: 80,
    rating: 4.8,
    numReviews: 124,
    featured: false,
    tags: ["book", "programming", "education", "technology"],
    specifications: new Map([
      ["Pages", "450"],
      ["Format", "Paperback"],
      ["Language", "English"],
      ["Publisher", "TechPress"],
    ]),
  },
  {
    name: "Mindfulness and Meditation",
    description:
      "A practical guide to finding peace and clarity in everyday life.",
    price: 199,
    originalPrice: 299,
    category: "Books",
    subcategory: "Self-Help",
    brand: "WellnessBooks",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
        alt: "Meditation Book",
      },
    ],
    stock: 95,
    rating: 4.6,
    numReviews: 78,
    featured: false,
    tags: ["book", "meditation", "wellness", "self-help"],
    specifications: new Map([
      ["Pages", "280"],
      ["Format", "Hardcover"],
      ["Language", "English"],
      ["Publisher", "WellnessBooks"],
    ]),
  },

  // Home & Garden
  {
    name: "Smart Home Security Camera",
    description:
      "4K wireless security camera with night vision and mobile app control.",
    price: 15920,
    originalPrice: 19920,
    category: "Home & Garden",
    subcategory: "Security",
    brand: "SecureHome",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Security Camera",
      },
    ],
    stock: 35,
    rating: 4.5,
    numReviews: 145,
    featured: true,
    tags: ["security", "camera", "smart-home", "wireless"],
    specifications: new Map([
      ["Resolution", "4K UHD"],
      ["Night Vision", "Yes"],
      ["Storage", "Cloud & Local"],
      ["Connectivity", "Wi-Fi"],
    ]),
  },
  {
    name: "Ergonomic Office Chair",
    description:
      "Premium ergonomic chair with lumbar support and adjustable features.",
    price: 23920,
    originalPrice: 31920,
    category: "Home & Garden",
    subcategory: "Furniture",
    brand: "ComfortSeating",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        alt: "Office Chair",
      },
    ],
    stock: 20,
    rating: 4.7,
    numReviews: 92,
    featured: false,
    tags: ["chair", "office", "ergonomic", "furniture"],
    specifications: new Map([
      ["Material", "Mesh & Fabric"],
      ["Weight Capacity", "300 lbs"],
      ["Adjustability", "Height, Arms, Lumbar"],
      ["Warranty", "5 Years"],
    ]),
  },

  // Sports
  {
    name: "Professional Tennis Racket",
    description:
      "High-performance tennis racket used by professional players worldwide.",
    price: 14320,
    originalPrice: 17520,
    category: "Sports",
    subcategory: "Tennis",
    brand: "ProSport",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Tennis Racket",
      },
    ],
    stock: 40,
    rating: 4.6,
    numReviews: 67,
    featured: false,
    tags: ["tennis", "racket", "sports", "professional"],
    specifications: new Map([
      ["Weight", "300g"],
      ["Head Size", "100 sq in"],
      ["String Pattern", "16x19"],
      ["Grip Size", '4 1/4"'],
    ]),
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat with superior cushioning and eco-friendly materials.",
    price: 499,
    originalPrice: 599,
    category: "Sports",
    subcategory: "Fitness",
    brand: "ZenFit",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
        alt: "Yoga Mat",
      },
    ],
    stock: 85,
    rating: 4.8,
    numReviews: 156,
    featured: true,
    tags: ["yoga", "fitness", "mat", "eco-friendly"],
    specifications: new Map([
      ["Thickness", "6mm"],
      ["Material", "Natural Rubber"],
      ["Size", '72" x 24"'],
      ["Weight", "2.5 lbs"],
    ]),
  },

  // Beauty
  {
    name: "Luxury Skincare Set",
    description:
      "Complete skincare routine with premium ingredients for radiant skin.",
    price: 11920,
    originalPrice: 15920,
    category: "Beauty",
    subcategory: "Skincare",
    brand: "GlowBeauty",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
        alt: "Skincare Set",
      },
    ],
    stock: 55,
    rating: 4.7,
    numReviews: 89,
    featured: true,
    tags: ["skincare", "beauty", "luxury", "anti-aging"],
    specifications: new Map([
      ["Items", "5-piece set"],
      ["Skin Type", "All skin types"],
      ["Key Ingredients", "Vitamin C, Hyaluronic Acid"],
      ["Cruelty Free", "Yes"],
    ]),
  },

  // Toys
  {
    name: "Educational Building Blocks",
    description:
      "Creative building blocks that enhance problem-solving and motor skills.",
    price: 349,
    originalPrice: 449,
    category: "Toys",
    subcategory: "Educational",
    brand: "SmartPlay",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558877385-1c4c7e9e1c6e?w=500",
        alt: "Building Blocks",
      },
    ],
    stock: 120,
    rating: 4.5,
    numReviews: 234,
    featured: false,
    tags: ["toys", "educational", "building", "kids"],
    specifications: new Map([
      ["Age Range", "3-8 years"],
      ["Pieces", "100 blocks"],
      ["Material", "Safe Plastic"],
      ["Educational Value", "STEM Learning"],
    ]),
  },

  // Automotive
  {
    name: "Car Phone Mount",
    description:
      "Universal car phone mount with 360-degree rotation and secure grip.",
    price: 249,
    originalPrice: 349,
    category: "Automotive",
    subcategory: "Accessories",
    brand: "DriveEasy",
    images: [
      {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500",
        alt: "Car Phone Mount",
      },
    ],
    stock: 200,
    rating: 4.3,
    numReviews: 445,
    featured: false,
    tags: ["car", "phone", "mount", "accessories"],
    specifications: new Map([
      ["Compatibility", "Universal"],
      ["Rotation", "360 degrees"],
      ["Mount Type", "Dashboard/Windshield"],
      ["Phone Size", "4-7 inches"],
    ]),
  },
  // Add these products to the existing products array

  // Electronics
  {
    name: "iPad Pro 12.9-inch",
    description:
      "The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and all-day battery life.",
    price: 87920,
    originalPrice: 95920,
    category: "Electronics",
    subcategory: "Tablets",
    brand: "Apple",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        alt: "iPad Pro",
      },
    ],
    stock: 30,
    rating: 4.8,
    numReviews: 178,
    featured: true,
    tags: ["tablet", "apple", "pro", "creative"],
    specifications: new Map([
      ["Display", "12.9-inch Liquid Retina XDR"],
      ["Chip", "M2"],
      ["Storage", "128GB"],
      ["Camera", "12MP Wide + 10MP Ultra Wide"],
    ]),
  },
  {
    name: "Samsung Galaxy Watch 6",
    description:
      "Advanced health monitoring, fitness tracking, and seamless connectivity with your smartphone.",
    price: 27920,
    originalPrice: 31920,
    category: "Electronics",
    subcategory: "Wearables",
    brand: "Samsung",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        alt: "Samsung Galaxy Watch",
      },
    ],
    stock: 65,
    rating: 4.5,
    numReviews: 132,
    featured: false,
    tags: ["smartwatch", "fitness", "health", "wearable"],
    specifications: new Map([
      ["Display", "1.4-inch Super AMOLED"],
      ["Battery Life", "40 hours"],
      ["Health Features", "Heart Rate, ECG, Sleep Tracking"],
      ["Compatibility", "Android & iOS"],
    ]),
  },

  // Clothing
  {
    name: "Classic Wool Sweater",
    description:
      "Warm and comfortable wool sweater perfect for chilly days and casual outings.",
    price: 6320,
    originalPrice: 7920,
    category: "Clothing",
    subcategory: "Sweaters",
    brand: "CozyKnits",
    images: [
      {
        url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
        alt: "Wool Sweater",
      },
    ],
    stock: 55,
    rating: 4.6,
    numReviews: 87,
    featured: false,
    tags: ["sweater", "wool", "warm", "casual"],
    specifications: new Map([
      ["Material", "100% Merino Wool"],
      ["Fit", "Regular"],
      ["Care", "Hand Wash Recommended"],
      ["Sizes", "S-XXL"],
    ]),
  },
  {
    name: "Professional Blazer",
    description:
      "Tailored blazer for a sharp, professional look that transitions from office to evening.",
    price: 10320,
    originalPrice: 12720,
    category: "Clothing",
    subcategory: "Blazers",
    brand: "ExecutiveStyle",
    images: [
      {
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        alt: "Professional Blazer",
      },
    ],
    stock: 40,
    rating: 4.7,
    numReviews: 64,
    featured: true,
    tags: ["blazer", "professional", "formal", "office"],
    specifications: new Map([
      ["Material", "Wool Blend"],
      ["Fit", "Slim"],
      ["Lining", "Full Satin Lining"],
      ["Closure", "Single Button"],
    ]),
  },

  // Books
  {
    name: "Culinary Masterpieces",
    description:
      "A collection of exquisite recipes from world-renowned chefs with step-by-step instructions.",
    price: 3600,
    originalPrice: 4400,
    category: "Books",
    subcategory: "Cooking",
    brand: "GourmetPress",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500",
        alt: "Cooking Book",
      },
    ],
    stock: 70,
    rating: 4.9,
    numReviews: 98,
    featured: true,
    tags: ["book", "cooking", "recipes", "culinary"],
    specifications: new Map([
      ["Pages", "320"],
      ["Format", "Hardcover"],
      ["Language", "English"],
      ["Recipes", "150+"],
    ]),
  },

  // Home & Garden
  {
    name: "Smart Plant Watering System",
    description:
      "Automated plant watering system with soil moisture sensors and app control.",
    price: 7120,
    originalPrice: 9520,
    category: "Home & Garden",
    subcategory: "Gardening",
    brand: "GreenThumb",
    images: [
      {
        url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
        alt: "Plant Watering System",
      },
    ],
    stock: 45,
    rating: 4.4,
    numReviews: 76,
    featured: false,
    tags: ["gardening", "smart", "automated", "plants"],
    specifications: new Map([
      ["Coverage", "Up to 20 plants"],
      ["Water Tank", "5L capacity"],
      ["Connectivity", "Wi-Fi & Bluetooth"],
      ["Power", "USB & Battery"],
    ]),
  },
  {
    name: "Premium Bedding Set",
    description:
      "Luxurious 1000-thread count Egyptian cotton bedding set for the ultimate sleep experience.",
    price: 15920,
    originalPrice: 19920,
    category: "Home & Garden",
    subcategory: "Bedding",
    brand: "SleepLux",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
        alt: "Bedding Set",
      },
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 112,
    featured: true,
    tags: ["bedding", "luxury", "cotton", "sleep"],
    specifications: new Map([
      ["Material", "100% Egyptian Cotton"],
      ["Thread Count", "1000"],
      ["Set Includes", "Duvet Cover, Sheets, Pillowcases"],
      ["Sizes", "Twin, Queen, King, California King"],
    ]),
  },

  // Sports
  {
    name: "Professional Basketball",
    description:
      "Official size and weight basketball with superior grip and durability for indoor and outdoor play.",
    price: 4720,
    originalPrice: 6320,
    category: "Sports",
    subcategory: "Basketball",
    brand: "CourtMaster",
    images: [
      {
        url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
        alt: "Basketball",
      },
    ],
    stock: 90,
    rating: 4.7,
    numReviews: 143,
    featured: false,
    tags: ["basketball", "sports", "professional", "durable"],
    specifications: new Map([
      ["Size", "Official Size 7"],
      ["Material", "Composite Leather"],
      ["Weight", "22 oz"],
      ["Indoor/Outdoor", "Yes"],
    ]),
  },

  // Beauty
  {
    name: "Professional Makeup Brush Set",
    description:
      "Complete set of premium synthetic brushes for flawless makeup application.",
    price: 6320,
    originalPrice: 7920,
    category: "Beauty",
    subcategory: "Makeup",
    brand: "GlamTools",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
        alt: "Makeup Brushes",
      },
    ],
    stock: 60,
    rating: 4.6,
    numReviews: 89,
    featured: false,
    tags: ["makeup", "brushes", "professional", "cosmetics"],
    specifications: new Map([
      ["Brushes", "12-piece set"],
      ["Bristles", "Premium Synthetic"],
      ["Handle", "Wooden"],
      ["Case", "Included"],
    ]),
  },

  // Toys
  {
    name: "Remote Control Car",
    description:
      "High-speed remote control car with realistic features and long-range control.",
    price: 3920,
    originalPrice: 5520,
    category: "Toys",
    subcategory: "Remote Control",
    brand: "SpeedRacer",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500",
        alt: "Remote Control Car",
      },
    ],
    stock: 85,
    rating: 4.4,
    numReviews: 156,
    featured: true,
    tags: ["toy", "remote control", "car", "kids"],
    specifications: new Map([
      ["Scale", "1:16"],
      ["Control Range", "100 feet"],
      ["Battery", "Rechargeable Li-ion"],
      ["Speed", "Up to 15 mph"],
    ]),
  },

  // Automotive
  {
    name: "Portable Car Jump Starter",
    description:
      "Compact power bank with jump starting capability for emergency situations.",
    price: 10320,
    originalPrice: 12720,
    category: "Automotive",
    subcategory: "Tools",
    brand: "PowerRescue",
    images: [
      {
        url: "https://images.unsplash.com/photo-1603712610494-93e15464bd7b?w=500",
        alt: "Car Jump Starter",
      },
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 234,
    featured: true,
    tags: ["car", "emergency", "battery", "portable"],
    specifications: new Map([
      ["Peak Current", "2000A"],
      ["Battery Capacity", "18000mAh"],
      ["Additional Features", "USB Charger, LED Light"],
      ["Compatibility", "All 12V vehicles"],
    ]),
  },
  {
    name: "All-Weather Floor Mats",
    description:
      "Durable, custom-fit floor mats that protect your vehicle's interior from dirt, mud, and spills.",
    price: 7120,
    originalPrice: 9520,
    category: "Automotive",
    subcategory: "Interior",
    brand: "AutoShield",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500",
        alt: "Car Floor Mats",
      },
    ],
    stock: 75,
    rating: 4.6,
    numReviews: 189,
    featured: false,
    tags: ["car", "mats", "protection", "interior"],
    specifications: new Map([
      ["Material", "Thermoplastic Rubber"],
      ["Fit", "Vehicle Specific"],
      ["Features", "Deep Channels, Anti-Slip"],
      ["Set", "Front & Rear Mats"],
    ]),
  },

  // Add more Electronics
  {
    name: "Wireless Charging Station",
    description:
      "Fast wireless charging station compatible with multiple devices simultaneously.",
    price: 5520,
    originalPrice: 7120,
    category: "Electronics",
    subcategory: "Accessories",
    brand: "ChargeTech",
    images: [
      {
        url: "https://images.unsplash.com/photo-1609091839311-d5365f2e0c5a?w=500",
        alt: "Wireless Charger",
      },
    ],
    stock: 120,
    rating: 4.3,
    numReviews: 267,
    featured: false,
    tags: ["charger", "wireless", "fast charging", "accessory"],
    specifications: new Map([
      ["Output", "15W per device"],
      ["Compatibility", "Qi-enabled devices"],
      ["Ports", "USB-C"],
      ["Simultaneous Charging", "3 devices"],
    ]),
  },
  {
    name: "Noise Cancelling Earbuds",
    description:
      "True wireless earbuds with active noise cancellation and premium sound quality.",
    price: 15920,
    originalPrice: 19920,
    category: "Electronics",
    subcategory: "Audio",
    brand: "SoundPeak",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
        alt: "Wireless Earbuds",
      },
    ],
    stock: 85,
    rating: 4.5,
    numReviews: 312,
    featured: true,
    tags: ["earbuds", "wireless", "noise-cancelling", "audio"],
    specifications: new Map([
      ["Battery Life", "8 hours (24 with case)"],
      ["Noise Cancellation", "Active"],
      ["Connectivity", "Bluetooth 5.2"],
      ["Water Resistance", "IPX4"],
    ]),
  },

  // Add more Home & Garden
  {
    name: "Smart Thermostat",
    description:
      "Energy-saving smart thermostat that learns your schedule and adjusts temperature automatically.",
    price: 19920,
    originalPrice: 23920,
    category: "Home & Garden",
    subcategory: "Smart Home",
    brand: "EcoHome",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
        alt: "Smart Thermostat",
      },
    ],
    stock: 40,
    rating: 4.7,
    numReviews: 198,
    featured: true,
    tags: ["thermostat", "smart home", "energy saving", "automation"],
    specifications: new Map([
      ["Compatibility", "Works with HVAC systems"],
      ["Connectivity", "Wi-Fi"],
      ["Display", "Color Touchscreen"],
      ["Voice Control", "Alexa, Google Assistant"],
    ]),
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/shopease"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Set exactly the first 8 products as featured
    products.forEach((product, index) => {
      product.featured = (index < 8);
    });

    // Create products
    const createdProducts = await Product.create(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log("Database seeded successfully!");
    console.log("\nDemo Credentials:");
    console.log("Admin: admin@shopease.com / admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
