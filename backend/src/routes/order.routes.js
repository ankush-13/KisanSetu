import express from "express";

import {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Buyer places order
router.post("/", protect, createOrder);

// Buyer views their orders
router.get("/my-orders", protect, getMyOrders);

// Farmer views received orders
router.get("/received", protect, getReceivedOrders);

// Farmer updates order status
router.patch("/:id/status", protect, updateOrderStatus);

export default router;