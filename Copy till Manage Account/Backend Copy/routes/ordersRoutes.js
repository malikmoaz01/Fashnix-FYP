import express from "express";
import { 
  createOrder, 
  getOrderById, 
  updateOrderStatus, 
  getUserOrders 
} from "../controllers/orderController.js";

const router = express.Router();

// Create new order
router.post("/order", createOrder);

// Get order by ID
router.get("/order/:orderId", getOrderById);

// Update order status
router.put("/order/:orderId/status", updateOrderStatus);

// Get all orders for a user
router.get("/user/:email/orders", getUserOrders);

export default router;
