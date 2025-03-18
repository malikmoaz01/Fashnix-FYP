import Product from "../models/productSchema.js";

// ➡️ Add New Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category , price, discountPrice, rating, reviews, stock , images  } = req.body;

    if (!name || !description || !price || images.length < 3) {
      return res.status(400).json({ message: "Fill all fields & add at least 3 images!" });
    }

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      discountPrice,
      rating,
      reviews,
      stock,
      images,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: savedProduct });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ➡️ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
