import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Plus,
  MapPin,
  Edit,
  Trash2,
  Sprout,
  Check,
  X,
  Clock,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("kisansetu_user") || "null"
  );

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products/my-products"),
        api.get("/orders/received"),
      ]);

      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
    } catch (error) {
      console.error("Dashboard error:", error);

      // Try loading products even if orders fail
      try {
        const productsRes = await api.get("/products/my-products");
        setProducts(productsRes.data.products || []);
      } catch (productError) {
        toast.error(
          productError.response?.data?.message ||
            "Failed to load dashboard"
        );
      }

      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load orders"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ============================================
  // DASHBOARD STATS
  // ============================================
  const totalProducts = products.length;

  const availableStock = products.reduce(
    (total, product) =>
      total + Number(product.quantity || 0),
    0
  );

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.totalPrice || 0),
    0
  );

  // ============================================
  // DELETE PRODUCT
  // ============================================
  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${productId}`);

      setProducts((prev) =>
        prev.filter(
          (product) => product._id !== productId
        )
      );

      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // ============================================
  // UPDATE ORDER STATUS
  // ============================================
  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      const response = await api.patch(
        `/orders/${orderId}/status`,
        { status }
      );

      // Update order in UI
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: response.data.order?.status || status,
              }
            : order
        )
      );

      const messages = {
        accepted: "Order accepted successfully",
        rejected: "Order rejected successfully",
        completed: "Order marked as completed",
        cancelled: "Order cancelled successfully",
      };

      toast.success(
        messages[status] ||
          `Order ${status} successfully`
      );
    } catch (error) {
      console.error("Update order error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ============================================
  // STATUS CLASS
  // ============================================
  const getOrderStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "status-badge accepted";

      case "completed":
        return "status-badge completed";

      case "rejected":
        return "status-badge rejected";

      case "cancelled":
        return "status-badge cancelled";

      default:
        return "status-badge pending";
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ============================================
            HEADER
        ============================================ */}
        <div className="dashboard-header">
          <div>
            <span className="section-eyebrow">
              FARMER PANEL
            </span>

            <h1>
              Welcome, {user?.name || "Farmer"} 👋
            </h1>

            <p>
              Manage your products and track your
              marketplace activity.
            </p>
          </div>

          <Link
            to="/create-product"
            className="primary-button"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* ============================================
            STATS
        ============================================ */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              <Package size={22} />
            </div>

            <div>
              <span>Total Products</span>
              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Sprout size={22} />
            </div>

            <div>
              <span>Available Stock</span>
              <strong>{availableStock}</strong>
              <small>quintals</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingBag size={22} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{totalOrders}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <IndianRupee size={22} />
            </div>

            <div>
              <span>Total Revenue</span>
              <strong>
                ₹{totalRevenue.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

        </div>

        {/* ============================================
            RECEIVED ORDERS
        ============================================ */}
        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>Received Orders</h2>

              <p>
                Manage orders placed by buyers.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-dashboard">
              <ShoppingBag size={42} />

              <h3>No orders yet</h3>

              <p>
                Orders placed by buyers will appear
                here.
              </p>
            </div>
          ) : (
            <div className="orders-list">

              {orders.map((order) => (
                <div
                  className="order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}
                  <div className="order-card-header">

                    <div>
                      <span className="order-label">
                        ORDER
                      </span>

                      <strong>
                        #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </strong>
                    </div>

                    <span
                      className={getOrderStatusClass(
                        order.status
                      )}
                    >
                      {order.status || "pending"}
                    </span>

                  </div>

                  {/* PRODUCT */}
                  <div className="order-product">

                    <div className="order-product-icon">
                      <Package size={24} />
                    </div>

                    <div className="order-product-info">

                      <h3>
                        {order.product?.name ||
                          "Agricultural Product"}
                      </h3>

                      <p>
                        {order.product?.category ||
                          "Agricultural Product"}
                      </p>

                    </div>

                  </div>

                  {/* ORDER DETAILS */}
                  <div className="order-details">

                    <div className="order-detail">
                      <span>Buyer</span>

                      <strong>
                        <User size={14} />

                        {order.buyer?.name ||
                          "Buyer"}
                      </strong>
                    </div>

                    <div className="order-detail">
                      <span>Quantity</span>

                      <strong>
                        {order.quantity}{" "}
                        {order.unit ||
                          order.product?.unit ||
                          "unit"}
                      </strong>
                    </div>

                    <div className="order-detail">
                      <span>Total Amount</span>

                      <strong className="order-price">
                        ₹
                        {Number(
                          order.totalPrice || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>

                  </div>

                  {/* DELIVERY ADDRESS */}
                  {order.deliveryAddress && (
                    <div className="delivery-address">

                      <MapPin size={17} />

                      <div>
                        <span>
                          Delivery Address
                        </span>

                        <p>
                          {order.deliveryAddress}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* ====================================
                      ACTION BUTTONS
                  ==================================== */}

                  {order.status === "pending" && (
                    <div className="order-actions">

                      <button
                        className="primary-button"
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "accepted"
                          )
                        }
                        disabled={
                          updatingOrder === order._id
                        }
                      >
                        <Check size={17} />

                        {updatingOrder ===
                        order._id
                          ? "Updating..."
                          : "Accept Order"}
                      </button>

                      <button
                        className="secondary-button danger-button"
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "rejected"
                          )
                        }
                        disabled={
                          updatingOrder === order._id
                        }
                      >
                        <X size={17} />

                        Reject Order
                      </button>

                    </div>
                  )}

                  {/* COMPLETE BUTTON */}
                  {order.status === "accepted" && (
                    <div className="order-actions">

                      <button
                        className="primary-button"
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "completed"
                          )
                        }
                        disabled={
                          updatingOrder === order._id
                        }
                      >
                        <Check size={17} />

                        {updatingOrder ===
                        order._id
                          ? "Updating..."
                          : "Mark Completed"}
                      </button>

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

        {/* ============================================
            MY PRODUCTS
        ============================================ */}
        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>My Products</h2>

              <p>
                Products you have listed on KisanSetu.
              </p>
            </div>

            <Link to="/marketplace">
              View Marketplace →
            </Link>

          </div>

          {products.length === 0 ? (

            <div className="empty-dashboard">

              <Package size={42} />

              <h3>No products yet</h3>

              <p>
                Start selling your agricultural
                products directly to buyers.
              </p>

              <Link
                to="/create-product"
                className="primary-button"
              >
                <Plus size={18} />
                Add Your First Product
              </Link>

            </div>

          ) : (

            <div className="products-table">

              <div className="table-header">
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Location</span>
                <span>Actions</span>
              </div>

              {products.map((product) => (

                <div
                  className="table-row"
                  key={product._id}
                >

                  <div className="product-name-cell">

                    <div className="product-mini-icon">
                      <Sprout size={18} />
                    </div>

                    <strong>
                      {product.name}
                    </strong>

                  </div>

                  <span>
                    {product.category}
                  </span>

                  <span>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                    {" / "}
                    {product.unit}
                  </span>

                  <span>
                    {product.quantity}{" "}
                    {product.unit}
                  </span>

                  <span className="location-cell">

                    <MapPin size={15} />

                    {product.location ||
                      "Not specified"}

                  </span>

                  <div className="action-buttons">

                    <Link
                      to={`/edit-product/${product._id}`}
                      className="icon-button"
                      title="Edit product"
                    >
                      <Edit size={16} />
                    </Link>

                    <button
                      className="icon-button danger"
                      title="Delete product"
                      onClick={() =>
                        deleteProduct(
                          product._id
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>
    </div>
  );
};

export default Dashboard;