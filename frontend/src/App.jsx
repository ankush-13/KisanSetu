import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import CreateProduct from "./pages/CreateProduct";
import Dashboard from "./pages/Dashboard";
import MyOrders from "./pages/MyOrders";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>

          {/* ============================================
              PUBLIC ROUTES
          ============================================ */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/marketplace"
            element={<Marketplace />}
          />


          {/* ============================================
              LOGGED-IN ROUTES
          ============================================ */}

          <Route element={<ProtectedRoute />}>

            {/* ==========================================
                FARMER ROUTES
            ========================================== */}

            <Route element={<RoleRoute allowedRole="farmer" />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/create-product"
                element={<CreateProduct />}
              />

            </Route>


            {/* ==========================================
                BUYER ROUTES
            ========================================== */}

            <Route element={<RoleRoute allowedRole="buyer" />}>

              <Route
                path="/my-orders"
                element={<MyOrders />}
              />

            </Route>

          </Route>


          {/* ============================================
              FALLBACK
          ============================================ */}

          <Route
            path="*"
            element={<Home />}
          />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;