import { useState } from "react";
import {
  Sprout,
  Package,
  IndianRupee,
  MapPin,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Grains",
    description: "",
    price: "",
    quantity: "",
    unit: "quintal",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("kisansetu_user") || "null"
  );

  // Farmer protection
  if (!user) {
    return (
      <div className="create-product-page">
        <div className="create-product-message">
          <h2>Login Required</h2>
          <p>
            Please login to create a product.
          </p>

          <Link to="/login" className="primary-button">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "farmer") {
    return (
      <div className="create-product-page">
        <div className="create-product-message">
          <h2>Farmer Access Required</h2>

          <p>
            Only farmers can create products on
            KisanSetu.
          </p>

          <Link
            to="/marketplace"
            className="primary-button"
          >
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter product description");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (
      !formData.quantity ||
      Number(formData.quantity) <= 0
    ) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter your location");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/products",
        {
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          unit: formData.unit,
          location: formData.location.trim(),
        }
      );

      if (response.data.success) {
        toast.success(
          "Product created successfully! 🌾"
        );

        navigate("/marketplace");
      }
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">

      {/* Back */}

      <Link
        to="/marketplace"
        className="back-link"
      >
        <ArrowLeft size={17} />
        Back to Marketplace
      </Link>

      {/* Header */}

      <div className="create-product-header">

        <div className="create-product-icon">
          <Sprout size={28} />
        </div>

        <div>
          <span className="section-label">
            FARMER PANEL
          </span>

          <h1>
            Add a New Product
          </h1>

          <p>
            List your agricultural products
            directly on KisanSetu.
          </p>
        </div>

      </div>

      {/* Form */}

      <form
        className="create-product-form"
        onSubmit={handleSubmit}
      >

        {/* Product Name */}

        <div className="form-group">

          <label>
            Product Name
          </label>

          <div className="input-with-icon">
            <Package size={18} />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wheat, Rice, Tomato"
              disabled={loading}
            />
          </div>

        </div>

        {/* Category */}

        <div className="form-group">

          <label>
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Grains">
              Grains
            </option>

            <option value="Vegetables">
              Vegetables
            </option>

            <option value="Fruits">
              Fruits
            </option>

            <option value="Pulses">
              Pulses
            </option>

            <option value="Spices">
              Spices
            </option>

            <option value="Oilseeds">
              Oilseeds
            </option>

            <option value="Other">
              Other
            </option>
          </select>

        </div>

        {/* Description */}

        <div className="form-group">

          <label>
            Description
          </label>

          <div className="input-with-icon textarea-wrapper">
            <FileText size={18} />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows="4"
              disabled={loading}
            />
          </div>

        </div>

        {/* Price + Quantity */}

        <div className="form-row">

          <div className="form-group">

            <label>
              Price
            </label>

            <div className="input-with-icon">
              <IndianRupee size={18} />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2800"
                min="1"
                disabled={loading}
              />
            </div>

          </div>

          <div className="form-group">

            <label>
              Quantity
            </label>

            <div className="input-with-icon">
              <Package size={18} />

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                min="1"
                disabled={loading}
              />
            </div>

          </div>

        </div>

        {/* Unit */}

        <div className="form-group">

          <label>
            Unit
          </label>

          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="quintal">
              Quintal
            </option>

            <option value="kg">
              Kilogram
            </option>

            <option value="ton">
              Ton
            </option>

            <option value="piece">
              Piece
            </option>

            <option value="crate">
              Crate
            </option>
          </select>

        </div>

        {/* Location */}

        <div className="form-group">

          <label>
            Location
          </label>

          <div className="input-with-icon">
            <MapPin size={18} />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Balaghat, Madhya Pradesh"
              disabled={loading}
            />
          </div>

        </div>

        {/* Submit */}

        <button
          type="submit"
          className="create-product-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="spin"
              />

              Creating Product...
            </>
          ) : (
            <>
              <Sprout size={18} />

              Create Product
            </>
          )}
        </button>

      </form>

    </div>
  );
};

export default CreateProduct;