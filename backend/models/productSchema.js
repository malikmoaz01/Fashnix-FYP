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
        "Men's Clothing",
        "Women's Clothing",
        "Kid's Clothing",
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
        // Men's Clothing
        "T-Shirts",
        "Jeans",
        "Jackets",
        "Formal Wear",
        "Ethnic Wear",
        // Women's & Kid's Clothing
        "Dresses",
        "Tops",
        "Abayas",
        "Kurtis",
        // Men's Shoes
        "Dress Shoes",
        "Casual Shoes",
        "Slipers",
        "Boots",
        "Sneakers",
        "Sandals",
        // Women's Shoes
        "Heels",
        "Flats",
        "Sneakers",
        "Sandals",
        "Boots",
        "Casual Shoes",
        // Mobile Accessories
        "Covers",
        "Chargers",
        "Headphones",
        "Smart Gadgets",
        // Laptop Accessories
        "Bags",
        "Mouse",
        "Cooling Pads",
        "Keyboards",
        // Other Accessories
        "Sunglasses",
        "Belts",
        "Wallets",
        "Jewelry",
        // Default
        "None"
      ],
      default: "None"
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
