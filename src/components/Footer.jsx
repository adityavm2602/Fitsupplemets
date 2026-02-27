import { NavLink } from "react-router-dom";
import {
  Dumbbell,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-col">
          <div className="footer-brand">
            <div className="footer-logo">
              <Dumbbell size={18} />
            </div>
            <div>
              <h3>FitSupplements</h3>
              <p>Premium fitness & nutrition store</p>
            </div>
          </div>

          <p className="footer-desc">
            Helping you achieve your fitness goals with trusted supplements,
            personalized recommendations, and secure shopping.
          </p>

          <div className="footer-socials">
            <Instagram size={18} />
            <Facebook size={18} />
            <Twitter size={18} />
            <Linkedin size={18} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <span>Whey Protein</span>
          <span>Mass Gainers</span>
          <span>Pre-Workout</span>
          <span>Fat Burners</span>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>

          <div className="footer-contact">
            <Mail size={16} />
            support@fitsupplements.com
          </div>

          <div className="footer-contact">
            <Phone size={16} />
            +91 98765 43210
          </div>

          <div className="footer-contact">
            <MapPin size={16} />
            Pune, Maharashtra, India
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} FitSupplements. All rights reserved.
      </div>
    </footer>
  );
}