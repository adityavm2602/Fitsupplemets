import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import "./cart.css";
import { api } from "../api"; // adjust the path if needed

export default function CartPage({ cart, total, removeFromCart, setCart }) {
  const itemsCount = cart.length;
  const [loading, setLoading] = useState(false);

  // Build the payload expected by backend checkout
  const buildCheckoutPayload = () =>
    cart.map((it) => ({
      id: it.id ?? null,
      name: it.name,
      category: it.category,
      price: Number(it.price),
      qty: it.qty ?? 1,
    }));

  const handleCheckout = async () => {
    if (itemsCount === 0) {
      alert("Cart is empty.");
      return;
    }

    if (!confirm("Proceed to generate invoice and download PDF?")) return;

    setLoading(true);
    try {
      // 1) POST to /checkout/ to create Order on backend
      const payload = { items: buildCheckoutPayload() };
      const res = await api.post("/checkout/", payload);

      // Expecting response: { order_id, total, invoice_url }
      const invoicePath = res.data.invoice_url; // e.g. "/api/invoice/3/"
      if (!invoicePath) throw new Error("Invoice URL missing from response");

      // 2) GET the PDF as blob (use absolute URL)
      // If invoicePath begins with '/api', remove duplicate '/api' because baseURL already contains /api.
      // We'll compute full URL robustly:
      const base = api.defaults.baseURL || "";
      // If invoicePath already contains the base, use as-is; otherwise prefix base.
      let invoiceUrl = invoicePath;
      if (!invoiceUrl.startsWith("http")) {
        // remove trailing slash from base if invoicePath starts with '/'
        if (base.endsWith("/") && invoiceUrl.startsWith("/")) {
          invoiceUrl = base.slice(0, -1) + invoiceUrl;
        } else {
          invoiceUrl = base + invoiceUrl;
        }
      }

      const pdfRes = await api.get(invoiceUrl, { responseType: "blob" });

      // 3) Trigger download in browser
      const blob = new Blob([pdfRes.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `invoice_order_${res.data.order_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);

      // 4) Clear cart (you passed setCart)
      if (typeof setCart === "function") {
        setCart([]);
      }

      alert("Invoice downloaded. Order created successfully.");
    } catch (err) {
      console.error(err);
      // Try to show backend message if present
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Checkout failed!";
      alert("Checkout failed:\n" + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart">
      <div className="container">
        <div className="cart-head">
          <div>
            <h1 className="cart-title">Cart</h1>
            <p className="cart-sub">Review your items and proceed to checkout.</p>
          </div>

          <div className="cart-pill">
            Items: <b>{itemsCount}</b> • Total: <b>₹ {total.toFixed(2)}</b>
          </div>
        </div>

        {itemsCount === 0 ? (
          <div className="empty card">
            <div className="empty-ico">
              <ShoppingBag size={22} />
            </div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-text">Add supplements from the shop and they’ll appear here.</div>

            <Link to="/shop" className="empty-btn">
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* LEFT: Items */}
            <div className="cart-items">
              <div className="section-row">
                <h2 className="section-title">Items</h2>
                <div className="muted">Showing {itemsCount} item(s)</div>
              </div>

              <div className="items-grid">
                {cart.map((item) => {
                  const imgSrc =
                    item.image ||
                    "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=1200&q=60";

                  return (
                    <div key={item.cartId} className="item card">
                      <div className="item-img">
                        <img
                          src={imgSrc}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/1200x600?text=Supplement";
                          }}
                        />
                      </div>

                      <div className="item-body">
                        <div className="item-top">
                          <div className="item-name">{item.name}</div>
                          <div className="item-price">₹ {Number(item.price).toFixed(2)}</div>
                        </div>

                        <div className="item-meta">
                          <span className="item-cat">
                            {(item.category || "supplement").toString().replace("_", " ")}
                          </span>
                        </div>

                        <button className="remove" onClick={() => removeFromCart(item.cartId)}>
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Summary */}
            <aside className="summary card">
              <div className="summary-title">Order Summary</div>

              <div className="summary-row">
                <span className="muted">Subtotal</span>
                <b>₹ {total.toFixed(2)}</b>
              </div>

              <div className="summary-row">
                <span className="muted">Shipping</span>
                <b>Free</b>
              </div>

              <div className="summary-line" />

              <div className="summary-row total">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>

              <button className="checkout" onClick={handleCheckout} disabled={loading}>
                <CreditCard size={18} />
                {loading ? "Generating Invoice..." : "Proceed to Checkout"}
              </button>

              <div className="summary-note">
                <ShieldCheck size={16} />
                Secure checkout UI demo — you can connect payments later.
              </div>

              <Link to="/shop" className="continue">
                <ShoppingBag size={16} />
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}