import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  MapPin,
  User,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH BUYER ORDERS
  // ============================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders/my-orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("My orders error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ============================================
  // STATUS STYLE
  // ============================================
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "status-badge confirmed";

      case "completed":
        return "status-badge completed";

      case "rejected":
      case "cancelled":
        return "status-badge cancelled";

      case "pending":
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
        <p>Loading your orders...</p>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================
  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* ================= HEADER ================= */}
        <div className="orders-header">
          <div>
            <span className="section-eyebrow">
              BUYER PANEL
            </span>

            <h1>My Orders</h1>

            <p>
              Track the agricultural products you have ordered.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="secondary-button"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>

        {/* ================= EMPTY ORDERS ================= */}
        {orders.length === 0 ? (
          <div className="empty-orders">

            <div className="empty-orders-icon">
              <ShoppingBag size={38} />
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
              Explore fresh products directly from farmers.
            </p>

            <Link
              to="/marketplace"
              className="primary-button"
            >
              <Package size={18} />
              Browse Marketplace
            </Link>

          </div>
        ) : (

          /* ================= ORDERS LIST ================= */
          <div className="orders-list">

            {orders.map((order) => {

              // Backend stores totalPrice
              const totalPrice = Number(order.totalPrice || 0);

              return (
                <div
                  className="order-card"
                  key={order._id}
                >

                  {/* ================= ORDER HEADER ================= */}
                  <div className="order-card-header">

                    <div>
                      <span className="order-label">
                        ORDER
                      </span>

                      <strong>
                        #{order._id.slice(-8).toUpperCase()}
                      </strong>
                    </div>

                    <span
                      className={getStatusClass(order.status)}
                    >
                      {order.status
                        ? order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        : "Pending"}
                    </span>

                  </div>

                  {/* ================= PRODUCT ================= */}
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

                  {/* ================= ORDER DETAILS ================= */}
                  <div className="order-details">

                    {/* Quantity */}
                    <div className="order-detail">

                      <span>Quantity</span>

                      <strong>
                        {order.quantity}{" "}
                        {order.unit ||
                          order.product?.unit ||
                          "unit"}
                      </strong>

                    </div>

                    {/* Total Amount */}
                    <div className="order-detail">

                      <span>Total Amount</span>

                      <strong className="order-price">
                        ₹
                        {totalPrice.toLocaleString("en-IN")}
                      </strong>

                    </div>

                    {/* Farmer */}
                    <div className="order-detail">

                      <span>Farmer</span>

                      <strong>
                        <User size={14} />

                        {order.farmer?.name ||
                          order.product?.farmer?.name ||
                          "Farmer"}
                      </strong>

                    </div>

                  </div>

                  {/* ================= PRICE BREAKDOWN ================= */}
                  <div className="order-price-breakdown">

                    <span>
                      ₹
                      {Number(
                        order.pricePerUnit || 0
                      ).toLocaleString("en-IN")}{" "}
                      / {order.unit || "unit"}
                    </span>

                    <span>
                      × {order.quantity}
                    </span>

                    <strong>
                      ₹
                      {totalPrice.toLocaleString("en-IN")}
                    </strong>

                  </div>

                  {/* ================= DELIVERY ADDRESS ================= */}
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

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;