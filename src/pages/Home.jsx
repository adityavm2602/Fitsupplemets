import { Link } from "react-router-dom";
import {
  Sparkles,
  ShoppingBag,
  Brain,
  Info,
  Dumbbell,
  Flame,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import "./home.css";

export default function Home() {
  const reviews = [
    {
      name: "Rahul P.",
      role: "Gym Enthusiast",
      rating: 5,
      text:
        "The AI quiz recommendations were surprisingly accurate. I found the right whey + creatine combo in minutes.",
    },
    {
      name: "Sneha K.",
      role: "Fat Loss Goal",
      rating: 5,
      text:
        "Clean UI and smooth shopping experience. Product details and descriptions look premium and easy to compare.",
    },
    {
      name: "Amit S.",
      role: "Strength Training",
      rating: 4,
      text:
        "Loved the categories and cart flow. Checkout + invoice feature makes it feel like a real e-commerce product.",
    },
  ];

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero-wrap">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="container hero">
          <div className="hero-left">
            <div className="tag">
              <Sparkles size={16} />
              AI Powered Fitness Store
            </div>

            <h1 className="hero-title">
              Upgrade your fitness with the right supplements{" "}
              <span className="accent">recommended for you</span>
            </h1>

            <p className="hero-subtitle">
              FitSupplements is a Django + React e-commerce site with an AI recommendation quiz.
              Pick your goal and we suggest the best products from your database.
            </p>

            <div className="cta-row">
              <Link to="/shop" className="btn btn-primary">
                <ShoppingBag size={18} />
                Shop Now
                <ArrowRight size={18} />
              </Link>

              <Link to="/shop" className="btn btn-soft">
                <Brain size={18} />
                Take AI Quiz
              </Link>

              <Link to="/about" className="btn btn-ghost">
                <Info size={18} />
                Learn More
              </Link>
            </div>

            <div className="stats">
              <Stat icon={<ShieldCheck size={18} />} label="Products" value="10+" />
              <Stat icon={<Dumbbell size={18} />} label="Goals" value="Muscle / Fat / Strength" />
              <Stat icon={<Zap size={18} />} label="Tech" value="Django + React" />
            </div>
          </div>

          <div className="hero-right">
            <div className="glass-card">
              <div className="image-wrap">
                <img
                  alt="Fitness"
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=60"
                />
              </div>

              <div className="glass-body">
                <div className="glass-title">Personalized Recommendations</div>
                <div className="glass-text">
                  Choose your goal & diet preference and our recommender filters products instantly.
                </div>

                <div className="chips">
                  <span className="chip">
                    <Dumbbell size={14} /> Muscle Gain
                  </span>
                  <span className="chip">
                    <Flame size={14} /> Fat Loss
                  </span>
                  <span className="chip">
                    <Zap size={14} /> Strength
                  </span>
                </div>

                <Link to="/shop" className="mini-cta">
                  Try the quiz <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section container">
        <div className="section-head">
          <h2>Why FitSupplements?</h2>
          <p>
            A clean demo e-commerce project to show your skills: API integration, routing, cart,
            and recommendations.
          </p>
        </div>

        <div className="feature-grid">
          <Feature
            icon={<Brain size={20} />}
            title="AI Recommendation Quiz"
            desc="User selects goal + diet + budget. We return best matching products from the Django database."
          />
          <Feature
            icon={<ShoppingBag size={20} />}
            title="Cart & Checkout Flow"
            desc="Add to cart, remove items, calculate total. Next step can be real orders & payments."
          />
          <Feature
            icon={<Sparkles size={20} />}
            title="Modern Multi-page UI"
            desc="React Router pages: Home, Shop, About, Cart, Product Details."
          />
        </div>
      </section>

      {/* ✅ CUSTOMER REVIEWS */}
      <section className="section container">
        <div className="section-head">
          <h2>Customer Reviews</h2>
          <p>What users are saying about FitSupplements.</p>
        </div>

        <div className="review-grid">
          {reviews.map((r, idx) => (
            <div key={idx} className="review-card">
              <div className="review-top">
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role">{r.role}</div>
                </div>

                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < r.rating ? "star on" : "star off"}
                    />
                  ))}
                </div>
              </div>

              <p className="review-text">“{r.text}”</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}