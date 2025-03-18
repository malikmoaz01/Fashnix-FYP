import mongoose from "mongoose";

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
    category: {
      type: String,
      required: true,
      enum: ["Shoes", "Clothing", "Watches", "Accessories"],
    },
    subcategory: {
      type: String,
      required: true,
      enum: [
        "Men's Shoes",
        "Women's Shoes",
        "Sports Shoes",
        "Casual Shoes",
        "Formal Shoes",
        "Men's Clothing",
        "Women's Clothing",
        "Men's Watches",
        "Women's Watches",
        "Smartwatches",
        "Luxury Watches",
        "Mobile Accessories",
        "Laptop Accessories",
        "Other Accessories",
      ],
    },
    subsubcategory: {
      type: String,
      enum: [
        // For Clothing
        "T-Shirts",
        "Jeans",
        "Jackets",
        "Formal Wear",
        "Ethnic Wear",
        "Dresses",
        "Tops",
        "Abayas",
        "Kurtis",
        // For Accessories
        "Covers",
        "Chargers",
        "Headphones",
        "Smart Gadgets",
        "Bags",
        "Mouse",
        "Cooling Pads",
        "Keyboards",
        "Sunglasses",
        "Belts",
        "Wallets",
        "Jewelry",
        // Optional, for clarity
        "None"
      ],
      default: "None" // Optional field
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (v) {
          return v <= this.price;
        },
        message: "Discount price cannot be greater than regular price",
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
      validate: [arrayLimit, "Maximum 5 images allowed"],
    },
    stock: [
      {
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
          validate: {
            validator: function (v) {
              return v >= 0;
            },
            message: "Stock quantity cannot be negative",
          },
        },
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5; 
}

const Product = mongoose.model("Product", productSchema);

export default Product;
