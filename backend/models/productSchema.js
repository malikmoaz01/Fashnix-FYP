import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    images: { type: [String], required: true }, 
    stock: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
