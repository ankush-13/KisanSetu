import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("kisansetu_user") || "null"
  );

  const isLoggedIn = !!user;
  const isFarmer = user?.role === "farmer";
  const isBuyer = user?.role === "buyer";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("kisansetu_user");
    localStorage.removeItem("kisansetu_token");

    closeMenu();

    toast.success("Logged out successfully");

    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* ============================================
            BRAND
        ============================================ */}
        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <div className="brand-icon">
            <Sprout size={22} />
          </div>

          <div>
            <span className="brand-name">
              KisanSetu
            </span>

            <span className="brand-tagline">
              Farm to Market
            </span>
          </div>
        </Link>

        {/* ============================================
            NAVIGATION
        ============================================ */}
        <nav
          className={`nav-menu ${
            menuOpen ? "open" : ""
          }`}
        >

          {/* Common Links */}
          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/marketplace"
            onClick={closeMenu}
          >
            Marketplace
          </Link>


          {/* ==========================================
              FARMER LINKS
          ========================================== */}
          {isFarmer && (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link
                to="/create-product"
                onClick={closeMenu}
              >
                <PlusCircle size={17} />
                Add Product
              </Link>
            </>
          )}


          {/* ==========================================
              BUYER LINKS
          ========================================== */}
          {isBuyer && (
            <Link
              to="/my-orders"
              onClick={closeMenu}
            >
              <ShoppingBag size={17} />
              My Orders
            </Link>
          )}


          {/* ==========================================
              LOGGED OUT
          ========================================== */}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-cta"
                onClick={closeMenu}
              >
                Join KisanSetu
              </Link>
            </>
          )}


          {/* ==========================================
              LOGGED IN
          ========================================== */}
          {isLoggedIn && (
            <div className="nav-user">

              <div className="user-info">
                <span className="user-badge">
                  {user?.name || "User"}
                </span>

                <span className="user-role">
                  {user?.role === "farmer"
                    ? "Farmer"
                    : "Buyer"}
                </span>
              </div>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>
          )}

        </nav>

        {/* ============================================
            MOBILE MENU
        ============================================ */}
        <button
          className="mobile-menu"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>

      </div>
    </header>
  );
};

export default Navbar;