import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      const data = response.data;

      if (data.success) {
        localStorage.setItem("kisansetu_token", data.token);

        if (data.user) {
          localStorage.setItem(
            "kisansetu_user",
            JSON.stringify(data.user)
          );
        }

        toast.success("Welcome back to KisanSetu!");

        navigate("/marketplace");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please try again."
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

          <h1>Welcome back</h1>

          <p>
            Login to continue your KisanSetu journey.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;