import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { api } from "../api";

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}/`)
      .then((res) => setP(res.data))
      .catch(() => setP(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Stable demo rating if backend doesn't provide rating
  const { rating, ratingCount } = useMemo(() => {
    const pid = Number(p?.id ?? id ?? 1) || 1;
    const seed = pid * 97 + String(p?.name ?? "").length * 13;
    const demoRating = 3.8 + ((seed % 13) / 10); // ~3.8 to ~5.0
    const r = Math.min(5, Math.max(3.5, Number(p?.rating ?? demoRating)));
    const c = Number(p?.rating_count ?? (60 + (seed % 240))); // 60–299
    return { rating: r, ratingCount: c };
  }, [p, id]);

  if (loading) {
    return <div style={{ padding: 16, color: "rgba(234,240,255,.70)" }}>Loading...</div>;
  }

  if (!p) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ margin: 0, color: "rgba(234,240,255,.96)" }}>Product not found</h2>
        <p style={{ color: "rgba(234,240,255,.70)" }}>
          This product may be deleted or out of stock.
        </p>
        <Link to="/shop" style={linkBtn}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const imgSrc =
    p.image ||
    "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=1200&q=60";

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/shop" style={linkBtn}>
        ← Back to Shop
      </Link>

      <div style={wrap}>
        <div style={imgBox}>
          <img
            src={imgSrc}
            alt={p.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=60";
            }}
          />
        </div>

        <div style={box}>
          <h1 style={{ margin: 0, color: "rgba(234,240,255,.96)" }}>{p.name}</h1>

          <div style={{ marginTop: 8, color: "rgba(234,240,255,.70)", textTransform: "capitalize" }}>
            Category: <b style={{ color: "rgba(234,240,255,.92)" }}>{p.category}</b>
          </div>

          {/* ✅ Rating row */}
          <div style={ratingRow}>
            <div style={starsWrap} aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
              {[...Array(5)].map((_, i) => {
                const idx = i + 1;
                const filled = idx <= fullStars;
                const half = !filled && hasHalf && idx === fullStars + 1;

                return (
                  <Star
                    key={i}
                    size={18}
                    style={{
                      color: filled || half ? "#fbbf24" : "rgba(234,240,255,.22)",
                      opacity: half ? 0.55 : 1,
                      filter: filled ? "drop-shadow(0 6px 16px rgba(251,191,36,.18))" : "none",
                    }}
                  />
                );
              })}
            </div>

            <div style={ratingText}>
              <b>{rating.toFixed(1)}</b>
              <span style={{ color: "rgba(234,240,255,.55)", fontWeight: 800 }}>
                ({ratingCount})
              </span>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 20, fontWeight: 1000, color: "rgba(234,240,255,.96)" }}>
            ₹ {p.price}
          </div>

          <p style={{ marginTop: 10, color: "rgba(234,240,255,.70)", lineHeight: 1.6 }}>
            {p.description || "No description added."}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {p.vegan ? <span style={badge}>Vegan</span> : null}
            {p.lactose_free ? <span style={badge}>Lactose Free</span> : null}
            {p.goal_muscle_gain ? <span style={badge}>Muscle Gain</span> : null}
            {p.goal_fat_loss ? <span style={badge}>Fat Loss</span> : null}
            {p.goal_strength ? <span style={badge}>Strength</span> : null}
          </div>

          <button onClick={() => addToCart(p)} style={btn}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const wrap = {
  marginTop: 12,
  display: "grid",
  gridTemplateColumns: "minmax(280px, 1fr) minmax(320px, 1fr)",
  gap: 14,
  alignItems: "start",
};

const imgBox = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 14,
  overflow: "hidden",
  height: 360,
  boxShadow: "0 16px 42px rgba(0,0,0,.22)",
  backdropFilter: "blur(12px)",
};

const box = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 14,
  padding: 16,
  boxShadow: "0 16px 42px rgba(0,0,0,.22)",
  backdropFilter: "blur(12px)",
};

const ratingRow = {
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const starsWrap = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const ratingText = {
  color: "rgba(234,240,255,.85)",
  fontSize: 13,
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const btn = {
  marginTop: 14,
  width: "100%",
  border: 0,
  borderRadius: 12,
  padding: "12px 12px",
  cursor: "pointer",
  fontWeight: 1000,
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#04130a",
  boxShadow: "0 14px 34px rgba(34,197,94,.16)",
};

const badge = {
  fontSize: 12,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  color: "rgba(234,240,255,.92)",
  fontWeight: 900,
};

const linkBtn = {
  display: "inline-block",
  textDecoration: "none",
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  color: "rgba(234,240,255,.92)",
  padding: "8px 12px",
  borderRadius: 12,
  fontWeight: 900,
  backdropFilter: "blur(12px)",
};