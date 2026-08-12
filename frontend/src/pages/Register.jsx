import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  ArrowRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      const data = response.data;

      if (data.success) {
        toast.success(
          "Account created successfully!"
        );

        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <div className="auth-logo">
            <Sprout size={25} />
          </div>

          <h1>Join KisanSetu</h1>

          <p>
            Create your account and connect with
            India's agricultural marketplace.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>I want to</label>

            <div className="role-options">

              <label
                className={`role-card ${
                  formData.role === "buyer"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={formData.role === "buyer"}
                  onChange={handleChange}
                />

                <span>🛒</span>

                <div>
                  <strong>Buy Products</strong>
                  <small>
                    Find fresh farm produce
                  </small>
                </div>
              </label>

              <label
                className={`role-card ${
                  formData.role === "farmer"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={formData.role === "farmer"}
                  onChange={handleChange}
                />

                <span>👨‍🌾</span>

                <div>
                  <strong>Sell Products</strong>
                  <small>
                    List your farm produce
                  </small>
                </div>
              </label>

            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  className="spin"
                  size={18}
                />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;