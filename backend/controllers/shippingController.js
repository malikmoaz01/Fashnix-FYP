// import Order from "../models/orderSchema.js";

// // Update tracking information for an order
// export const updateTracking = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { trackingNumber, status } = req.body;
    
//     const order = await Order.findOne({ orderId });
    
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
    
//     // Update tracking number
//     if (!order.delivery) {
//       order.delivery = {};
//     }
    
//     order.delivery.trackingNumber = trackingNumber;
    
//     // Update status if provided
//     if (status) {
//       order.status = status;
//     }
    
//     await order.save();
    
//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Error updating tracking information:", error);
//     res.status(500).json({ 
//       message: "Failed to update tracking information", 
//       error: error.message 
//     });
//   }
// };

// // Mark order as delivered
// export const markAsDelivered = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     const order = await Order.findOne({ orderId });
    
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
    
//     // Update status to delivered
//     order.status = 'delivered';
    
//     // Set delivery date to now
//     if (!order.delivery) {
//       order.delivery = {};
//     }
    
//     await order.save();
    
//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Error marking order as delivered:", error);
//     res.status(500).json({ 
//       message: "Failed to mark order as delivered", 
//       error: error.message 
//     });
//   }
// };

// // Get shipping statistics
// export const getShippingStats = async (req, res) => {
//   try {
//     const stats = {
//       total: await Order.countDocuments({}),
//       pending: await Order.countDocuments({ status: 'pending' }),
//       processing: await Order.countDocuments({ status: 'processing' }),
//       shipped: await Order.countDocuments({ status: 'shipped' }),
//       delivered: await Order.countDocuments({ status: 'delivered' })
//     };
    
//     // Get processing time metrics
//     const processingTimeMetrics = await Order.aggregate([
//       { $match: { status: { $in: ['shipped', 'delivered'] } } },
//       {
//         $project: {
//           processingDays: {
//             $divide: [
//               { $subtract: [
//                 "$delivery.shippedDate", 
//                 "$createdAt"
//               ] },
//               1000 * 60 * 60 * 24 // Convert ms to days
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           avgProcessingDays: { $avg: "$processingDays" },
//           minProcessingDays: { $min: "$processingDays" },
//           maxProcessingDays: { $max: "$processingDays" }
//         }
//       }
//     ]);
    
//     res.status(200).json({
//       counts: stats,
//       processingMetrics: processingTimeMetrics.length > 0 ? processingTimeMetrics[0] : {
//         avgProcessingDays: 0,
//         minProcessingDays: 0,
//         maxProcessingDays: 0
//       }
//     });
//   } catch (error) {
//     console.error("Error getting shipping statistics:", error);
//     res.status(500).json({ 
//       message: "Failed to get shipping statistics", 
//       error: error.message 
//     });
//   }
// };

// // Get pending shipments
// export const getPendingShipments = async (req, res) => {
//   try {
//     const pendingShipments = await Order.find({ 
//       status: 'processing',
//       'delivery.trackingNumber': { $exists: false }
//     }).sort({ createdAt: 1 }); // Oldest first
    
//     res.status(200).json(pendingShipments);
//   } catch (error) {
//     console.error("Error getting pending shipments:", error);
//     res.status(500).json({ 
//       message: "Failed to get pending shipments", 
//       error: error.message 
//     });
//   }
// };

// // Get orders with tracking number (shipped but not delivered)
// export const getActiveShipments = async (req, res) => {
//   try {
//     const activeShipments = await Order.find({ 
//       status: 'shipped',
//       'delivery.trackingNumber': { $exists: true, $ne: '' }
//     }).sort({ createdAt: -1 }); // Newest first
    
//     res.status(200).json(activeShipments);
//   } catch (error) {
//     console.error("Error getting active shipments:", error);
//     res.status(500).json({ 
//       message: "Failed to get active shipments", 
//       error: error.message 
//     });
//   }
// };

// // Update order schema with delivery date
// export const updateOrderSchema = async () => {
//   // This function is meant to be run once to update the schema
//   // It's not an API endpoint
//   try {
//     const orders = await Order.find({ status: 'shipped' });
    
//     for (const order of orders) {
//       if (!order.delivery) {
//         order.delivery = {};
//       }
      
//       if (!order.delivery.shippedDate) {
//         // For existing orders, set shipped date to a week after creation
//         const shippedDate = new Date(order.createdAt);
//         shippedDate.setDate(shippedDate.getDate() + 7);
//         order.delivery.shippedDate = shippedDate;
//         await order.save();
//       }
//     }
    
//     console.log("Order schema updated successfully");
//   } catch (error) {
//     console.error("Error updating order schema:", error);
//   }
// };
import Order from "../models/orderSchema.js";

/**
 * Update shipping tracking information for an order
 */
export const updateTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, carrier, estimatedDelivery, notes } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update shipping details
    order.delivery = {
      ...order.delivery,
      trackingNumber,
      carrier,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : order.delivery.estimatedDelivery,
      notes: notes || order.delivery.notes
    };
    
    // If order status is pending or processing, update to shipped
    if (order.status === 'pending' || order.status === 'processing') {
      order.status = 'shipped';
      order.delivery.shippedDate = new Date();
      
      // Add status change to history (this will be handled by pre-save middleware,
      // but we add a custom comment)
      order.statusHistory.push({
        status: 'shipped',
        timestamp: new Date(),
        comment: `Order shipped via ${carrier}. Tracking number: ${trackingNumber}`
      });
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

/**
 * Mark an order as delivered
 */
export const markAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { signedBy, notes } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update delivery information
    order.status = 'delivered';
    order.delivery.deliveredDate = new Date();
    
    if (signedBy) {
      order.delivery.signedBy = signedBy;
    }
    
    if (notes) {
      order.delivery.notes = notes;
    }
    
    // Add custom status history entry
    order.statusHistory.push({
      status: 'delivered',
      timestamp: new Date(),
      comment: signedBy ? `Delivered and signed by ${signedBy}` : 'Delivered'
    });
    
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

/**
 * Get shipping-related statistics
 */
export const getShippingStats = async (req, res) => {
  try {
    // Get counts by status
    const stats = {
      pending: await Order.countDocuments({ status: 'pending' }),
      processing: await Order.countDocuments({ status: 'processing' }),
      shipped: await Order.countDocuments({ status: 'shipped' }),
      delivered: await Order.countDocuments({ status: 'delivered' }),
      total: await Order.countDocuments({})
    };
    
    // Calculate average delivery time for completed orders
    const deliveryTimeStats = await Order.aggregate([
      { 
        $match: { 
          status: 'delivered',
          'delivery.shippedDate': { $exists: true, $ne: null },
          'delivery.deliveredDate': { $exists: true, $ne: null }
        } 
      },
      {
        $project: {
          deliveryTime: { 
            $divide: [
              { $subtract: ['$delivery.deliveredDate', '$delivery.shippedDate'] },
              1000 * 60 * 60 * 24 // Convert milliseconds to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDeliveryTime: { $avg: '$deliveryTime' },
          minDeliveryTime: { $min: '$deliveryTime' },
          maxDeliveryTime: { $max: '$deliveryTime' }
        }
      }
    ]);
    
    // Get carrier statistics
    const carrierStats = await Order.aggregate([
      { $match: { 'delivery.carrier': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$delivery.carrier',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get monthly shipping stats
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    const monthlyShipping = await Order.aggregate([
      { 
        $match: { 
          'delivery.shippedDate': { $exists: true, $ne: null, $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$delivery.shippedDate' },
            month: { $month: '$delivery.shippedDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.status(200).json({
      counts: stats,
      deliveryTime: deliveryTimeStats.length > 0 ? {
        average: deliveryTimeStats[0].avgDeliveryTime.toFixed(1),
        minimum: deliveryTimeStats[0].minDeliveryTime.toFixed(1),
        maximum: deliveryTimeStats[0].maxDeliveryTime.toFixed(1)
      } : null,
      carriers: carrierStats,
      monthlyTrends: monthlyShipping
    });
  } catch (error) {
    console.error("Error getting shipping statistics:", error);
    res.status(500).json({ 
      message: "Failed to get shipping statistics", 
      error: error.message 
    });
  }
};

/**
 * Get all orders pending shipment
 */
export const getPendingShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const pendingOrders = await Order.find({ 
      status: { $in: ['pending', 'processing'] } 
    })
    .sort({ createdAt: 1 }) // Oldest first
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Order.countDocuments({ 
      status: { $in: ['pending', 'processing'] } 
    });
    
    res.status(200).json({
      orders: pendingOrders,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    res.status(500).json({ 
      message: "Failed to get pending shipments", 
      error: error.message 
    });
  }
};

/**
 * Get all orders that have been shipped but not yet delivered
 */
export const getActiveShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10, carrier } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { status: 'shipped' };
    
    // Add carrier filter if provided
    if (carrier) {
      filter['delivery.carrier'] = carrier;
    }
    
    const activeShipments = await Order.find(filter)
    .sort({ 'delivery.shippedDate': 1 }) // Oldest shipments first
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Order.countDocuments(filter);
    
    // Get list of carriers for filtering
    const carriers = await Order.aggregate([
      { $match: { 'delivery.carrier': { $exists: true, $ne: null } } },
      { $group: { _id: '$delivery.carrier' } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      orders: activeShipments,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      },
      carriers: carriers.map(c => c._id)
    });
  } catch (error) {
    console.error("Error getting active shipments:", error);
    res.status(500).json({ 
      message: "Failed to get active shipments", 
      error: error.message 
    });
  }
};