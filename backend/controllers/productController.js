import Product from "../models/productSchema.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, subsubcategory, price, discountPrice, rating, reviews, stock, images } = req.body;

    if (!name || !description || !price || images.length < 3) {
      return res.status(400).json({ message: "Fill all fields & add at least 3 images!" });
    }

    const newProduct = new Product({
      name,
      description,
      category,
      subcategory,
      subsubcategory,
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

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const editProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, category, price, discountPrice, rating, reviews, stock, images } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.rating = rating || product.rating;
    product.reviews = reviews || product.reviews;
    product.stock = stock || product.stock;
    product.images = images.length > 0 ? images : product.images;

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.error("Edit Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
