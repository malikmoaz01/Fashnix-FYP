import Order from "../models/orderSchema.js";
import { sendOrderConfirmationEmail } from '../config/emailService.js';

export const createOrder = async (req, res) => {
  try {
    const existingOrder = await Order.findOne({ orderId: req.body.orderId });
    
    if (existingOrder) {
      return res.json(existingOrder);
    }
    
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
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
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(filter);
    
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

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
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

export const getUserOrders = async (req, res) => {
  try {
    const { email, id } = req.params;
    let filter = {};
    
    if (email) {
      filter = { "customer.email": email };
    } else if (id) {
      filter = { "userId": id };
    } else {
      return res.status(400).json({ message: "User identifier required" });
    }
    
    const orders = await Order.find(filter)
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
    
    const revenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    
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

export const sendConfirmation = async (req, res) => {
  try {
    const { orderId, email } = req.body;
    
    if (!orderId || !email) {
      return res.status(400).json({ message: 'Order ID and email are required' });
    }
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const emailOrderData = {
      orderId: order.orderId,
      customerEmail: email,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: new Date(),
      totalAmount: order.total,
      items: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        street: order.customer.address.line1 + (order.customer.address.line2 ? ', ' + order.customer.address.line2 : ''),
        city: order.customer.address.city,
        state: order.customer.address.state,
        zipCode: order.customer.address.postalCode,
        country: order.customer.address.country
      }
    };
    
    const emailResult = await sendOrderConfirmationEmail(emailOrderData);
    
    res.status(200).json({ 
      message: 'Confirmation email sent successfully',
      emailId: emailResult.id
    });
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ message: 'Failed to send confirmation email', error: error.message });
  }
};