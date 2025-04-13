import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  getUserOrders,
  deleteOrder,
  getOrderStats,
  sendConfirmation
} from '../controllers/orderController.js';

import {
  updateTracking,
  markAsDelivered,
  getShippingStats,
  getPendingShipments,
  getActiveShipments
} from '../controllers/shippingController.js';

const router = express.Router();

// Public routes
router.post('/orders', createOrder);
router.get('/orders/:orderId', getOrderById);

// User routes (No authentication)
router.get('/user/:email/orders', getUserOrders);
// Add this new route to match frontend request
router.get('/users/:id/orders', getUserOrders);

// Admin routes (No authentication)
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);
router.put('/orders/:orderId', updateOrder);
router.delete('/orders/:orderId', deleteOrder);

// Email confirmation route - add this line
router.post('/orders/send-confirmation', sendConfirmation);

// Shipping specific routes
router.put('/orders/:orderId/tracking', updateTracking);
router.put('/orders/:orderId/deliver', markAsDelivered);
router.get('/shipping/stats', getShippingStats);
router.get('/shipping/pending', getPendingShipments);
router.get('/shipping/active', getActiveShipments);

// Order statistics route - must be placed before the parameterized routes
router.get('/orders-stats', getOrderStats);

export default router;