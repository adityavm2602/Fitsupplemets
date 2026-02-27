import {
  Sparkles,
  ShieldCheck,
  Dumbbell,
  ShoppingBag,
  HeartPulse,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import "./about.css";

export default function About() {
  return (
    <div className="about">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-bg" />
        <div className="about-overlay" />

        <div className="about-inner">
          <div className="about-left">
            <div className="about-badge">
              <Sparkles size={16} />
              About FitSupplements
            </div>

            <h1 className="about-title">
              Your trusted online store for{" "}
              <span className="about-accent">fitness supplements</span>
            </h1>

            <p className="about-sub">
              FitSupplements supports your fitness journey—whether your goal is muscle gain, fat loss,
              or overall wellness. We focus on quality products, fair pricing, and a smooth shopping
              experience.
            </p>

            <div className="about-cta">
              <a className="about-btn primary" href="/shop">
                <ShoppingBag size={18} /> Explore Shop <ArrowRight size={18} />
              </a>
              <a className="about-btn ghost" href="/shop">
                <Dumbbell size={18} /> Take AI Quiz
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="about-stats">
            <Stat
              icon={<ShieldCheck size={18} />}
              label="What We Do"
              value="Supplements for Fitness"
            />
            <Stat
              icon={<ShoppingBag size={18} />}
              label="Products"
              value="Protein • Gainers • Pre-workout"
            />
            <Stat
              icon={<HeartPulse size={18} />}
              label="For"
              value="Beginners • Gym Lovers • Athletes"
            />
            <Stat
              icon={<BadgeCheck size={18} />}
              label="Promise"
              value="Quality • Trust • Value"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="about-section">
        <div className="about-grid">
          <Card
            title="Who We Are"
            icon={<Dumbbell size={18} />}
            desc="We are a fitness-first team passionate about helping people build healthier lifestyles.
            FitSupplements is built to make trusted supplements easy to discover and simple to buy online."
          />

          <Card
            title="Our Mission"
            icon={<ShieldCheck size={18} />}
            desc="Our mission is to provide high-quality supplements that help customers achieve real results—
            with transparency, affordability, and customer-first service. We believe fitness should be accessible
            to everyone."
          />

          <Card
            title="What You’ll Find Here"
            icon={<Sparkles size={18} />}
            list={[
              "Trusted supplements for muscle gain & recovery",
              "Products for weight management & wellness",
              "Easy browsing, product details, and cart",
              "Simple recommendations to help you choose better",
            ]}
          />
        </div>

        <div className="about-note">
          <ShieldCheck size={16} />
          Need help choosing? We’re building FitSupplements to make shopping simple, reliable, and goal-focused—so
          you can stay consistent with your fitness journey.
        </div>
      </section>
    </div>
  );
}

function Card({ title, desc, icon, list }) {
  return (
    <div className="about-card">
      <div className="about-card-head">
        <div className="about-icon">{icon}</div>
        <div className="about-card-title">{title}</div>
      </div>

      {desc && <p className="about-card-text">{desc}</p>}

      {list && (
        <ul className="about-list">
          {list.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="about-stat">
      <div className="about-stat-top">
        <span className="about-stat-ico">{icon}</span>
        <span className="about-stat-label">{label}</span>
      </div>
      <div className="about-stat-value">{value}</div>
    </div>
  );
}