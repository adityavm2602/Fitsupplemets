import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import "./login.css";
import { api } from "../api"; // your axios instance: baseURL http://127.0.0.1:8000/api

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 4 && !loading;
  }, [email, password, loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // ✅ OPTION A (recommended): Your backend should return token + user
      // endpoint example: POST /api/auth/login/
      const res = await api.post("/auth/login/", { email, password });

      // Expect: { token: "...", user: {...} }
      const token = res?.data?.token;
      const user = res?.data?.user;

      if (!token) {
        throw new Error("Login succeeded but token missing in response.");
      }

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // OPTIONAL: set default auth header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/");
    } catch (error) {
      // If your backend returns {detail:"..."} or {message:"..."}
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid credentials or server not responding.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-wrap">
        {/* Left: Brand / Info */}
        <div className="login-brand">
          <div className="login-logo">
            <div className="logo-badge">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="brand-name">FitSupplements</div>
              <div className="brand-sub">Secure sign in to continue</div>
            </div>
          </div>

          <h1 className="login-title">
            Welcome back<span className="accent">.</span>
          </h1>
          <p className="login-desc">
            Sign in to access your cart, orders, and personalized recommendations.
          </p>

          <div className="login-points">
            <div className="pt">
              <span className="dot" />
              Faster checkout & invoices
            </div>
            <div className="pt">
              <span className="dot" />
              Save your recommendations
            </div>
            <div className="pt">
              <span className="dot" />
              Track orders & history
            </div>
          </div>

          <div className="login-links">
            <Link className="link" to="/">
              ← Back to Home
            </Link>
            <Link className="link" to="/shop">
              Go to Shop →
            </Link>
          </div>
        </div>

        {/* Right: Form */}
        <div className="login-card">
          <div className="card-head">
            <div className="card-icon">
              <LockKeyhole size={18} />
            </div>
            <div>
              <div className="card-title">Login</div>
              <div className="card-sub">Enter your details to continue</div>
            </div>
          </div>

          {err ? <div className="login-error">{err}</div> : null}

          <form onSubmit={onSubmit} className="login-form">
            <label className="field">
              <span className="label">Email</span>
              <div className="input-wrap">
                <Mail size={18} className="input-ico" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="field">
              <span className="label">Password</span>
              <div className="input-wrap">
                <LockKeyhole size={18} className="input-ico" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="row">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              {/* If you have a page/route */}
              <Link className="small-link" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button className="btn-primary" disabled={!canSubmit}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="divider">
              <span />
              <p>or</p>
              <span />
            </div>

            {/* Optional: Replace with Google login later */}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => alert("Demo: add social login later")}
            >
              Continue as Guest (Demo)
            </button>

            <p className="bottom-text">
              Don’t have an account?{" "}
              <Link className="small-link" to="/register">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}