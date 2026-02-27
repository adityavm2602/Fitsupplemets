import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Target,
  Leaf,
  Wallet,
  Search,
  ShoppingCart,
  Tag,
  ArrowRight,
  Star,
} from "lucide-react";
import "./shop.css";

export default function Shop({
  products,
  reco,
  goal,
  diet,
  budget,
  setGoal,
  setDiet,
  setBudget,
  getRecommendations,
  addToCart,
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(
      (products || [])
        .map((p) => (p.category || "").toLowerCase())
        .filter(Boolean)
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (products || []).filter((p) => {
      const matchQ =
        !query ||
        String(p.name || "").toLowerCase().includes(query) ||
        String(p.description || "").toLowerCase().includes(query) ||
        String(p.category || "").toLowerCase().includes(query);

      const matchCat =
        cat === "all" || String(p.category || "").toLowerCase() === cat;

      return matchQ && matchCat;
    });
  }, [products, q, cat]);

  return (
    <div className="shop">
      <div className="container">
        {/* Header */}
        <div className="shop-head">
          <div>
            <h1 className="shop-title">Shop</h1>
            <p className="shop-sub">
              Use the quiz to get recommendations, then add items to your cart.
            </p>
          </div>

          <div className="filters">
            <div className="input">
              <Search size={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search supplements..."
              />
            </div>

            <div className="select">
              <Tag size={16} />
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All categories" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <div className="quiz card">
          <div className="quiz-top">
            <div className="quiz-title">
              <Sparkles size={18} />
              AI Recommendation Quiz
            </div>
            <div className="quiz-hint">
              Pick goal + diet + budget → get best matches
            </div>
          </div>

          <div className="quiz-grid">
            <Field icon={<Target size={16} />} label="Goal">
              <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="strength">Strength</option>
              </select>
            </Field>

            <Field icon={<Leaf size={16} />} label="Diet">
              <select value={diet} onChange={(e) => setDiet(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="vegan">Vegan</option>
                <option value="lactose_free">Lactose Free</option>
              </select>
            </Field>

            <Field icon={<Wallet size={16} />} label="Budget">
              <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="low">Low (≤1500)</option>
                <option value="medium">Medium (≤3000)</option>
                <option value="high">High</option>
              </select>
            </Field>

            <button className="btn-primary full" onClick={getRecommendations}>
              Get Recommendations <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Recommendations */}
        {reco?.length > 0 && (
          <section className="section">
            <div className="section-row">
              <h2 className="section-title">Recommended for you</h2>
              <div className="pill">Based on your quiz</div>
            </div>

            <div className="product-grid">
              {reco.map((p) => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} accent />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="section">
          <div className="section-row">
            <h2 className="section-title">All Products</h2>
            <div className="muted">
              Showing <b>{filtered.length}</b> items
            </div>
          </div>

          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onAdd={addToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {icon}
        {label}
      </span>
      <div className="field-control">{children}</div>
    </label>
  );
}

function ProductCard({ p, onAdd, accent }) {
  const imgSrc =
    p.image ||
    "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=1200&q=60";

  // ✅ Demo rating (stable) if backend doesn't provide rating
  const seed = (p?.id ?? 1) * 97 + String(p?.name ?? "").length * 13;
  const demoRating = 3.8 + ((seed % 13) / 10); // ~3.8 to ~5.0
  const rating = Math.min(5, Math.max(3.5, Number(p?.rating ?? demoRating)));
  const ratingCount = Number(p?.rating_count ?? (60 + (seed % 240))); // 60–299

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={`product card ${accent ? "accent" : ""}`}>
      <div className="product-img">
        <img
          src={imgSrc}
          alt={p.name}
          onError={(e) => {
            e.currentTarget.onerror = null; // prevent loop
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=60";
          }}
        />
        {accent && <div className="badge">Recommended</div>}
      </div>

      <div className="product-body">
        <Link className="product-name" to={`/product/${p.id}`}>
          {p.name}
        </Link>

        <div className="product-meta">
          <div className="price">₹ {p.price}</div>
          <div className="cat">{String(p.category || "supplement")}</div>
        </div>

        {/* ✅ Rating row */}
        <div className="rating-row">
          <div className="stars" aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
            {[...Array(5)].map((_, i) => {
              const idx = i + 1;
              const filled = idx <= fullStars;
              const half = !filled && hasHalf && idx === fullStars + 1;

              return (
                <Star
                  key={i}
                  size={16}
                  className={`star ${filled ? "on" : half ? "half" : "off"}`}
                />
              );
            })}
          </div>

          <div className="rating-text">
            <b>{rating.toFixed(1)}</b>
            <span className="rating-count">({ratingCount})</span>
          </div>
        </div>

        <div className="desc">
          {p.description?.trim() ? p.description : "No description available."}
        </div>

        <button className={`btn ${accent ? "btn-accent" : ""}`} onClick={() => onAdd(p)}>
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}