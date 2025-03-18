import express from "express";
import { addProduct, getProducts, editProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

// ➡️ Add Product Route (POST)
router.post("/products", addProduct);

// ➡️ Get Products Route (GET)
router.get("/products", getProducts);

// ➡️ Edit Product Route (PUT)
router.put("/products/:productId", editProduct);

// ➡️ Delete Product Route (DELETE)
router.delete("/products/:productId", deleteProduct);

export default router;
