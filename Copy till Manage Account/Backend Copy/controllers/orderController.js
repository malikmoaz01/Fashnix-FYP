import Order from "../models/orderSchema.js"
// Create new order
export const createOrder = async (req, res) => {
    try {
      const orderData = req.body;
      
      // Check if order already exists (to prevent duplicates)
      const existingOrder = await Order.findOne({ orderId: orderData.orderId });
      
      if (existingOrder) {
        return res.status(200).json(existingOrder);
      }
      
      // Create new order
      const newOrder = new Order(orderData);
      await newOrder.save();
      
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ 
        message: "Failed to create order", 
        error: error.message 
      });
    }
  };
  
  // Get order by ID
  export const getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.status(200).json(order);
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).json({ 
        message: "Failed to get order", 
        error: error.message 
      });
    }
  };
  
  // Update order status
  export const updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      order.status = status;
      await order.save();
      
      res.status(200).json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ 
        message: "Failed to update order status", 
        error: error.message 
      });
    }
  };
  
  // Get all orders for a user
  export const getUserOrders = async (req, res) => {
    try {
      const { email } = req.params;
      
      const orders = await Order.find({ "customer.email": email })
        .sort({ createdAt: -1 });
      
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting user orders:", error);
      res.status(500).json({ 
        message: "Failed to get user orders", 
        error: error.message 
      });
    }
  };