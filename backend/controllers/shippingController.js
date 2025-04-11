import Order from "../models/orderSchema.js";

// Update tracking information for an order
export const updateTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, status } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update tracking number
    if (!order.delivery) {
      order.delivery = {};
    }
    
    order.delivery.trackingNumber = trackingNumber;
    
    // Update status if provided
    if (status) {
      order.status = status;
    }
    
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating tracking information:", error);
    res.status(500).json({ 
      message: "Failed to update tracking information", 
      error: error.message 
    });
  }
};

// Mark order as delivered
export const markAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update status to delivered
    order.status = 'delivered';
    
    // Set delivery date to now
    if (!order.delivery) {
      order.delivery = {};
    }
    
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    res.status(500).json({ 
      message: "Failed to mark order as delivered", 
      error: error.message 
    });
  }
};

// Get shipping statistics
export const getShippingStats = async (req, res) => {
  try {
    const stats = {
      total: await Order.countDocuments({}),
      pending: await Order.countDocuments({ status: 'pending' }),
      processing: await Order.countDocuments({ status: 'processing' }),
      shipped: await Order.countDocuments({ status: 'shipped' }),
      delivered: await Order.countDocuments({ status: 'delivered' })
    };
    
    // Get processing time metrics
    const processingTimeMetrics = await Order.aggregate([
      { $match: { status: { $in: ['shipped', 'delivered'] } } },
      {
        $project: {
          processingDays: {
            $divide: [
              { $subtract: [
                "$delivery.shippedDate", 
                "$createdAt"
              ] },
              1000 * 60 * 60 * 24 // Convert ms to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgProcessingDays: { $avg: "$processingDays" },
          minProcessingDays: { $min: "$processingDays" },
          maxProcessingDays: { $max: "$processingDays" }
        }
      }
    ]);
    
    res.status(200).json({
      counts: stats,
      processingMetrics: processingTimeMetrics.length > 0 ? processingTimeMetrics[0] : {
        avgProcessingDays: 0,
        minProcessingDays: 0,
        maxProcessingDays: 0
      }
    });
  } catch (error) {
    console.error("Error getting shipping statistics:", error);
    res.status(500).json({ 
      message: "Failed to get shipping statistics", 
      error: error.message 
    });
  }
};

// Get pending shipments
export const getPendingShipments = async (req, res) => {
  try {
    const pendingShipments = await Order.find({ 
      status: 'processing',
      'delivery.trackingNumber': { $exists: false }
    }).sort({ createdAt: 1 }); // Oldest first
    
    res.status(200).json(pendingShipments);
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    res.status(500).json({ 
      message: "Failed to get pending shipments", 
      error: error.message 
    });
  }
};

// Get orders with tracking number (shipped but not delivered)
export const getActiveShipments = async (req, res) => {
  try {
    const activeShipments = await Order.find({ 
      status: 'shipped',
      'delivery.trackingNumber': { $exists: true, $ne: '' }
    }).sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json(activeShipments);
  } catch (error) {
    console.error("Error getting active shipments:", error);
    res.status(500).json({ 
      message: "Failed to get active shipments", 
      error: error.message 
    });
  }
};

// Update order schema with delivery date
export const updateOrderSchema = async () => {
  // This function is meant to be run once to update the schema
  // It's not an API endpoint
  try {
    const orders = await Order.find({ status: 'shipped' });
    
    for (const order of orders) {
      if (!order.delivery) {
        order.delivery = {};
      }
      
      if (!order.delivery.shippedDate) {
        // For existing orders, set shipped date to a week after creation
        const shippedDate = new Date(order.createdAt);
        shippedDate.setDate(shippedDate.getDate() + 7);
        order.delivery.shippedDate = shippedDate;
        await order.save();
      }
    }
    
    console.log("Order schema updated successfully");
  } catch (error) {
    console.error("Error updating order schema:", error);
  }
};