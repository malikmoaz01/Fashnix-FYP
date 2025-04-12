import Order from "../models/orderSchema.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
  //   const orderData = req.body;
    
  //   // Check if order already exists (to prevent duplicates)
  //   const existingOrder = await Order.findOne({ orderId: orderData.orderId });
    
  //   if (existingOrder) {
  //     return res.status(200).json(existingOrder);
  //   }
    
  //   // Create new order
  //   const newOrder = new Order(orderData);
  //   await newOrder.save();
    
  //   res.status(201).json(newOrder);
  // } catch (error) {
  //   console.error("Error creating order:", error);
  //   res.status(500).json({ 
  //     message: "Failed to create order", 
  //     error: error.message 
  //   });
  // }
      // Check if order already exists
      const existingOrder = await Order.findOne({ orderId: req.body.orderId });
    
      if (existingOrder) {
        // Order exists, return it without trying to create a new one
        return res.json(existingOrder);
      }
      
      // Order doesn't exist, create new one
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders with optional filtering
export const getAllOrders = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { orderId: searchRegex },
        { "customer.email": searchRegex },
        { "customer.firstName": searchRegex },
        { "customer.lastName": searchRegex },
        { "customer.phone": searchRegex }
      ];
    }
    
    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Order.countDocuments(filter);
    
    // Get order statistics
    const stats = {
      total: await Order.countDocuments({}),
      pending: await Order.countDocuments({ status: 'pending' }),
      processing: await Order.countDocuments({ status: 'processing' }),
      shipped: await Order.countDocuments({ status: 'shipped' }),
      delivered: await Order.countDocuments({ status: 'delivered' }),
      cancelled: await Order.countDocuments({ status: 'cancelled' })
    };
    
    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ 
      message: "Failed to get orders", 
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

// Update order details
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'status', 
      'delivery.trackingNumber', 
      'delivery.estimatedDelivery',
      'notes',
      'payment.status'
    ];
    
    allowedUpdates.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (updateData[parent] && updateData[parent][child] !== undefined) {
          order[parent][child] = updateData[parent][child];
        }
      } else if (updateData[field] !== undefined) {
        order[field] = updateData[field];
      } 
    });
    
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ 
      message: "Failed to update order", 
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

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    await Order.deleteOne({ orderId });
    
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ 
      message: "Failed to delete order", 
      error: error.message 
    });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const stats = {
      total: await Order.countDocuments({}),
      pending: await Order.countDocuments({ status: 'pending' }),
      processing: await Order.countDocuments({ status: 'processing' }),
      shipped: await Order.countDocuments({ status: 'shipped' }),
      delivered: await Order.countDocuments({ status: 'delivered' }),
      cancelled: await Order.countDocuments({ status: 'cancelled' })
    };
    
    // Get revenue statistics
    const revenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Get monthly order trends
    const lastSixMonths = new Date();
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 5);
    lastSixMonths.setDate(1);
    lastSixMonths.setHours(0, 0, 0, 0);
    
    const monthlyTrends = await Order.aggregate([
      { $match: { createdAt: { $gte: lastSixMonths } } },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    res.status(200).json({
      counts: stats,
      revenue: revenue.length > 0 ? revenue[0].total : 0,
      todayOrders,
      monthlyTrends
    });
  } catch (error) {
    console.error("Error getting order statistics:", error);
    res.status(500).json({ 
      message: "Failed to get order statistics", 
      error: error.message 
    });
  }
};
