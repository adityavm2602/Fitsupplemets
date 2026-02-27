import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { api } from "./api";

import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/ProductDetails";
import Chatbot from "./components/Chatbot";
import Login from "./pages/login"; // ✅ NEW
import Footer from "./components/Footer";

import {
  Dumbbell,
  ShoppingBag,
  Info,
  ShoppingCart,
  LogIn,
  LogOut,
  User2,
} from "lucide-react";

import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);

  // quiz
  const [goal, setGoal] = useState("muscle_gain");
  const [diet, setDiet] = useState("normal");
  const [budget, setBudget] = useState("medium");
  const [reco, setReco] = useState([]);

  // cart
  const [cart, setCart] = useState([]);

  // ✅ auth user (persist)
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    api
      .get("/products/")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Django server not running!"));
  }, []);

  const addToCart = (p) => {
    setCart((prev) => [...prev, { ...p, cartId: Date.now() + Math.random() }]);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((x) => x.cartId !== cartId));
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price), 0);
  }, [cart]);

  const getRecommendations = async () => {
    try {
      const res = await api.post("/recommend/", { goal, diet, budget });
      setReco(res.data.recommendations);
    } catch {
      alert("Recommendation API failed!");
    }
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar
          cartCount={cart.length}
          total={total}
          user={user}
          setUser={setUser}
        />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* ✅ LOGIN ROUTE */}
            <Route path="/login" element={<Login setUser={setUser} />} />

            <Route
              path="/shop"
              element={
                <Shop
                  products={products}
                  reco={reco}
                  goal={goal}
                  diet={diet}
                  budget={budget}
                  setGoal={setGoal}
                  setDiet={setDiet}
                  setBudget={setBudget}
                  getRecommendations={getRecommendations}
                  addToCart={addToCart}
                />
              }
            />

            <Route
              path="/product/:id"
              element={<ProductDetails addToCart={addToCart} />}
            />

            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  total={total}
                  removeFromCart={removeFromCart}
                  setCart={setCart}
                />
              }
            />

            <Route
              path="*"
              element={<div className="not-found">Page not found</div>}
            />
          </Routes>
        </main>

        <Chatbot />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Navbar({ cartCount, total, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <div className="brand-icon">
            <Dumbbell size={18} />
          </div>
          <div>
            <div className="brand-title">FitSupplements</div>
            <div className="brand-sub">Multi-page E-commerce</div>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-ico">
              <ShoppingBag size={16} />
              Shop
            </span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-ico">
              <Info size={16} />
              About
            </span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-ico">
              <ShoppingCart size={16} />
              Cart
            </span>
          </NavLink>

          {/* ✅ USER PILL */}
          {user ? (
            <div className="user-pill">
              <User2 size={16} />
              <span>{user.username}</span>
            </div>
          ) : null}

          {/* ✅ LOGIN / LOGOUT */}
          {user ? (
            <button className="nav-auth" onClick={handleLogout}>
              <span className="nav-ico">
                <LogOut size={16} />
                Logout
              </span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-ico">
                <LogIn size={16} />
                Login
              </span>
            </NavLink>
          )}

          <div className="cart-pill">
            Cart: <b>{cartCount}</b> • <b>₹ {total.toFixed(2)}</b>
          </div>
        </nav>
      </div>
    </header>
  );
}