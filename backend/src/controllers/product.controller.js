import Product from "../models/Product.js";

// ============================================
// CREATE PRODUCT
// ============================================
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      quantity,
      unit,
      district,
      state,
      image,
    } = req.body;

    // Validation
    if (
      !name ||
      !category ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, category, price and quantity are required",
      });
    }

    const product = await Product.create({
      farmer: req.user.userId,
      name,
      category,
      description,
      price,
      quantity,
      unit,
      location: {
        district,
        state,
      },
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product listed successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================
// GET ALL PRODUCTS
// WITH SEARCH + FILTER + SORT
// ============================================
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      district,
      state,
      sort,
    } = req.query;

    // Base filter
    const filter = {
      isAvailable: true,
    };

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by district
    if (district) {
      filter["location.district"] = {
        $regex: district,
        $options: "i",
      };
    }

    // Filter by state
    if (state) {
      filter["location.state"] = {
        $regex: state,
        $options: "i",
      };
    }

    // Default sorting: newest first
    let sortOption = {
      createdAt: -1,
    };

    // Lowest price first
    if (sort === "price_low") {
      sortOption = {
        price: 1,
      };
    }

    // Highest price first
    if (sort === "price_high") {
      sortOption = {
        price: -1,
      };
    }

    // Newest products first
    if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    const products = await Product.find(filter)
      .populate("farmer", "name phone location")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================
// GET FARMER'S PRODUCTS
// ============================================
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmer: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get my products error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};