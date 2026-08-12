import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Package,
  ShoppingCart,
  Loader2,
  Filter,
  X,
  Minus,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [ordering, setOrdering] = useState(false);

  // Get currently logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("kisansetu_user") || "null"
  );

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      if (response.data.success) {
        const productList = response.data.products || [];

        setProducts(productList);
        setFilteredProducts(productList);
      }
    } catch (error) {
      console.error("Fetch products error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search + category filtering
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.location
            ?.toString()
            .toLowerCase()
            .includes(query)
        );
      });
    }

    if (category !== "all") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [search, category, products]);

  // Get unique categories
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Open order modal
  const openOrderModal = (product) => {
    // Extra frontend protection
    const farmerId =
      typeof product.farmer === "object"
        ? product.farmer?._id
        : product.farmer;

    if (
      currentUser?._id &&
      farmerId &&
      farmerId.toString() === currentUser._id.toString()
    ) {
      toast.error("You cannot order your own product");
      return;
    }

    setSelectedProduct(product);
    setQuantity(1);
    setDeliveryAddress("");
  };

  // Close order modal
  const closeOrderModal = () => {
    if (ordering) return;

    setSelectedProduct(null);
    setQuantity(1);
    setDeliveryAddress("");
  };

  // Increase quantity
  const increaseQuantity = () => {
    if (!selectedProduct) return;

    if (quantity < selectedProduct.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(
        `Only ${selectedProduct.quantity} ${selectedProduct.unit} available`
      );
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  // Place order
  const handleOrder = async () => {
    if (!selectedProduct) return;

    const token = localStorage.getItem(
      "kisansetu_token"
    );

    if (!token) {
      toast.error("Please login to place an order");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error(
        "Please enter your delivery address"
      );
      return;
    }

    if (quantity <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (quantity > selectedProduct.quantity) {
      toast.error(
        `Only ${selectedProduct.quantity} ${selectedProduct.unit} available`
      );
      return;
    }

    try {
      setOrdering(true);

      const response = await api.post("/orders", {
        productId: selectedProduct._id,
        quantity,
        deliveryAddress: deliveryAddress.trim(),
      });

      if (response.data.success) {
        toast.success(
          "Order placed successfully! 🎉"
        );

        closeOrderModal();

        // Refresh products so updated stock is displayed
        await fetchProducts();
      }
    } catch (error) {
      console.error("Create order error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to place order"
      );
    } finally {
      setOrdering(false);
    }
  };

  // Calculate total
  const totalPrice = selectedProduct
    ? selectedProduct.price * quantity
    : 0;

  return (
    <div className="marketplace-page">

      {/* ================= HEADER ================= */}

      <section className="marketplace-header">
        <div>
          <span className="section-label">
            KISANSETU MARKETPLACE
          </span>

          <h1>
            Fresh from the
            <span> farm.</span>
          </h1>

          <p>
            Discover agricultural products directly
            from farmers.
          </p>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}

      <section className="marketplace-controls">

        {/* Search */}

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Category */}

        <div className="category-filter">
          <Filter size={17} />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="products-section">

        {loading ? (
          <div className="loading-state">

            <Loader2
              className="spin"
              size={30}
            />

            <p>
              Loading fresh products...
            </p>

          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">

            <Package size={45} />

            <h3>
              No products found
            </h3>

            <p>
              Try another search or category.
            </p>

          </div>
        ) : (
          <div className="products-grid">

            {filteredProducts.map((product) => {

              /*
               * Determine whether the product
               * belongs to the logged-in farmer.
               *
               * product.farmer may be:
               * 1. An ObjectId string
               * 2. A populated farmer object
               */

              const farmerId =
                typeof product.farmer === "object"
                  ? product.farmer?._id
                  : product.farmer;

              const isOwnProduct =
                currentUser?._id &&
                farmerId &&
                farmerId.toString() ===
                  currentUser._id.toString();

              return (
                <div
                  className="market-product-card"
                  key={product._id}
                >

                  {/* PRODUCT IMAGE */}

                  <div className="market-product-image">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div className="product-placeholder">
                        🌾
                      </div>
                    )}

                    <span
                      className={
                        isOwnProduct
                          ? "availability-badge own-badge"
                          : "availability-badge"
                      }
                    >
                      {isOwnProduct
                        ? "Your Product"
                        : "Available"}
                    </span>

                  </div>

                  {/* PRODUCT CONTENT */}

                  <div className="market-product-content">

                    <span className="product-category">
                      {product.category ||
                        "Agriculture"}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    {/* LOCATION */}

                    <div className="farmer-location">

                      <MapPin size={14} />

                      <span>
                        {product.location?.district ||
                          product.location ||
                          "India"}
                      </span>

                    </div>

                    {/* PRICE + STOCK */}

                    <div className="market-product-price">

                      <div>
                        <strong>
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}
                        </strong>

                        <span>
                          {" "}
                          / {product.unit}
                        </span>
                      </div>

                      <span className="stock">
                        {product.quantity}{" "}
                        {product.unit} available
                      </span>

                    </div>

                    {/* ORDER BUTTON */}

                    {isOwnProduct ? (
                      <button
                        className="market-order-button own-product-button"
                        disabled
                      >
                        Your Product
                      </button>
                    ) : (
                      <button
                        className="market-order-button"
                        onClick={() =>
                          openOrderModal(product)
                        }
                        disabled={
                          !product.quantity ||
                          product.quantity <= 0
                        }
                      >
                        <ShoppingCart size={17} />

                        {product.quantity > 0
                          ? "Order Product"
                          : "Out of Stock"}
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* ================= ORDER MODAL ================= */}

      {selectedProduct && (
        <div
          className="order-modal-overlay"
          onClick={closeOrderModal}
        >

          <div
            className="order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="modal-close"
              onClick={closeOrderModal}
              disabled={ordering}
            >
              <X size={20} />
            </button>

            {/* PRODUCT INFO */}

            <div className="modal-product">

              <div className="modal-product-image">

                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />
                ) : (
                  <span>🌾</span>
                )}

              </div>

              <div>

                <span className="product-category">
                  {selectedProduct.category ||
                    "Agriculture"}
                </span>

                <h2>
                  {selectedProduct.name}
                </h2>

                <p>
                  ₹
                  {Number(
                    selectedProduct.price
                  ).toLocaleString("en-IN")}{" "}
                  / {selectedProduct.unit}
                </p>

              </div>

            </div>

            {/* QUANTITY */}

            <div className="quantity-section">

              <label>
                Quantity
              </label>

              <div className="quantity-control">

                <button
                  onClick={decreaseQuantity}
                  disabled={ordering}
                  type="button"
                >
                  <Minus size={17} />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={ordering}
                  type="button"
                >
                  <Plus size={17} />
                </button>

                <small>
                  {selectedProduct.unit}
                </small>

              </div>

              <p className="available-text">
                {selectedProduct.quantity}{" "}
                {selectedProduct.unit} available
              </p>

            </div>

            {/* DELIVERY ADDRESS */}

            <div className="delivery-section">

              <label>
                Delivery Address
              </label>

              <textarea
                value={deliveryAddress}
                onChange={(e) =>
                  setDeliveryAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your complete delivery address"
                rows="3"
                disabled={ordering}
              />

            </div>

            {/* TOTAL */}

            <div className="order-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* CONFIRM */}

            <button
              className="confirm-order-button"
              onClick={handleOrder}
              disabled={ordering}
              type="button"
            >

              {ordering ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />

                  Placing order...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />

                  Confirm Order
                </>
              )}

            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Marketplace;