import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ============================================
// CREATE ORDER
// ============================================
export const createOrder = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      deliveryAddress,
    } = req.body;

    if (!productId || !quantity || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Product, quantity and delivery address are required",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check availability
    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Product is no longer available",
      });
    }

    // Check quantity
    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} ${product.unit} available`,
      });
    }

    // Buyer cannot order their own product
    if (product.farmer.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot order your own product",
      });
    }

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      buyer: req.user.userId,
      farmer: product.farmer,
      product: product._id,
      quantity,
      unit: product.unit,
      pricePerUnit: product.price,
      totalPrice,
      deliveryAddress,
    });

    // Reduce available quantity
    product.quantity -= quantity;

    if (product.quantity === 0) {
      product.isAvailable = false;
    }

    await product.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email phone")
      .populate("farmer", "name email phone")
      .populate("product", "name category price unit");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================
// GET BUYER ORDERS
// ============================================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user.userId,
    })
      .populate("farmer", "name phone")
      .populate("product", "name category price unit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get buyer orders error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================
// GET ORDERS RECEIVED BY FARMER
// ============================================
export const getReceivedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      farmer: req.user.userId,
    })
      .populate("buyer", "name phone email")
      .populate("product", "name category price unit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get received orders error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================
// UPDATE ORDER STATUS
// ============================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only farmer can accept/reject/complete
    if (order.farmer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
      order,
    });
  } catch (error) {
    console.error("Update order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};