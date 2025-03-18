import express from "express";
import { addProduct, getProducts, editProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

// Product Routes
router.post("/products", addProduct);
router.get("/products", getProducts);
router.put("/products/:productId", editProduct);
router.delete("/products/:productId", deleteProduct);

export default router;
