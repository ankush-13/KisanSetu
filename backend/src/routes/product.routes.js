import express from "express";

import {
  createProduct,
  getProducts,
  getMyProducts,
} from "../controllers/product.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Public marketplace
router.get("/", getProducts);

// Protected farmer routes
router.post("/", protect, createProduct);
router.get("/my-products", protect, getMyProducts);

export default router;