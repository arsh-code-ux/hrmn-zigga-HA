import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Artwork", path: "/artwork" },
    { label: "Artist", path: "/artist" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contest", path: "/contest" },
    { label: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-fixed">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <div className="logo-icon">◆</div>
          <span className="logo-text">Ziggratus</span>
        </div>

        {/* Menu Items - Desktop */}
        <div className="navbar-menu desktop-menu">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Icons */}
        <div className="navbar-icons">
          <button className="icon-btn" aria-label="Search">
            🔍
          </button>
          <button className="icon-btn" aria-label="User">
            👤
          </button>
          <button className="icon-btn" aria-label="Cart">
            🛒
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="navbar-menu mobile-menu">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
