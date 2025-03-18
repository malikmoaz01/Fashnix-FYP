import express from "express";
import { addProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

// ➡️ Add Product Route (POST)
router.post("/products", addProduct);

// ➡️ Get Products Route (GET)
router.get("/products", getProducts);

export default router;
