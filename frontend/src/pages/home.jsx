import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaGlobe, FaMapMarkerAlt, FaHamburger, FaTruck, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import "../css/home.css";
import axios from "axios";

// Import images
import logo from "../images/ByteBitesLogoHorizontal.png";
import burgerDecor from "../images/burger-1.png";
import sushiBoard from "../images/sushi-1.png";
import pizzaIcon from "../images/pizza-1.png";
import burgerIcon from "../images/burger-1-2.png";
import sandwichIcon from "../images/sandwich-1.png";
import pastaIcon from "../images/pasta-1.png";
import ramenIcon from "../images/ramen-1.png";
import sushiIcon from "../images/sushi-2.png";
import handshake from "../images/handshake.jpg";
import rider from "../images/rider.jpg";

function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDeliverRegister, setShowDeliverRegister] = useState(false);
  const [showOwnerRegister, setShowOwnerRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/auth/logged/user", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        if (res.data.role === "DELIVER") {
          navigate("/deliver");
        }
      })
      .catch(() => setUser(null));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setMenuOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const foodTypes = [
    { icon: pizzaIcon, label: "PIZZA" },
    { icon: burgerIcon, label: "BURGER" },
    { icon: sandwichIcon, label: "SANDWICH" },
    { icon: pastaIcon, label: "PASTA" },
    { icon: ramenIcon, label: "RAMEN" },
    { icon: sushiIcon, label: "SUSHI" }
  ];

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <img src={logo} alt="ByteBites Logo" className="logo" />
          
          <div className="auth-buttons">
            {user ? (
              <div className="relative">
                <button
                  className="text-5xl text-gray-700 hover:text-gray-900 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <FaUserCircle />
                </button>

                {user.role === "OWNER" && (
                  <button
                    className="btn btn-create-account"
                    onClick={() => navigate("/add-restaurant")}
                  >
                    Add Restaurant
                  </button>
                )}

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/profile")}
                    >
                      View Profile
                    </button>
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn btn-login" onClick={() => setShowLogin(true)}>
                  Log in
                </button>
                <button className="btn btn-create-account" onClick={() => setShowRegister(true)}>
                  Create Account
                </button>
                <button className="btn btn-driver" onClick={() => document.getElementById('work-with-us').scrollIntoView({ behavior: 'smooth' })}>
                  Become a Driver
                </button>
                <button className="language-selector">
                  <FaGlobe />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <img src={sushiBoard} alt="" className="decorative-image sushi-board" />
          <img src={burgerDecor} alt="" className="decorative-image burger" />
          
          <h1 className="hero-title">Welcome to ByteBites</h1>
          <p className="hero-subtitle">
            ByteBites is a delicious service offering a unique experience
            that helps you satisfy your hunger.
          </p>
          <button className="search-button">
            SEARCH ALL RESTAURANTS
          </button>
        </section>

        <div className="food-types-container">
          <section className="food-types">
            <h2 className="section-title">TYPES OF FOOD</h2>
            <div className="food-grid">
              {foodTypes.map((food, index) => (
                <div key={index} className="food-item">
                  <img src={food.icon} alt={food.label} className="food-icon" />
                  <span className="food-label">{food.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="how-to-order">
            <h2 className="section-title">HOW TO ORDER</h2>
            <div className="order-steps">
              <div className="order-step">
                <div className="step-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>TELL US WHERE YOU WANT US</h3>
                <p></p>
              </div>
              <div className="order-step">
                <div className="step-icon">
                  <FaHamburger />
                </div>
                <h3>CHOOSE WHAT TO EAT</h3>
                <p></p>
              </div>
              <div className="order-step">
                <div className="step-icon">
                  <FaTruck />
                </div>
                <h3>ORDER AND TRACK</h3>
                <p></p>
              </div>
            </div>
          </section>

          <section className="work-with-us" id="work-with-us">
            <h2 className="section-title">WANT TO WORK WITH US?</h2>
            <div className="opportunities">
              <div className="opportunity-card">
                <div className="opportunity-image">
                  <img src={handshake} alt="Restaurant interior" />
                </div>
                <p className="opportunity-text">
                  ByteBytes provides an opportunity for any restaurant-related business to expand its operations in the online space.
                </p>
                <button className="opportunity-button" onClick={() => setShowOwnerRegister(true)}>
                  GROW YOUR BUSINESS
                </button>
              </div>

              <div className="opportunity-card">
                <div className="opportunity-image">
                  <img src={rider} alt="Delivery person on bicycle" />
                </div>
                <p className="opportunity-text">
                  Do you like to get around the city by car, motorbike or bicycle? What's better than getting paid for it?
                </p>
                <button className="opportunity-button" onClick={() => setShowDeliverRegister(true)}>
                  BECOME A DELIVER
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>LET US HELP</h3>
            <ul>
              <li><a href="#">CONTACT US</a></li>
              <li><a href="#">TERMS OF USE</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>USEFUL INFORMATION</h3>
            <ul>
              <li><a href="#">ABOUT US</a></li>
              <li><a href="#">CONTACT</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">TERMS & CONDITIONS</a></li>
              <li><a href="#">PRIVACY POLICY</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>GET TO KNOW US</h3>
            <ul>
              <li><a href="#work-with-us" className="become-rider-link">BECOME A DRIVER</a></li>
              <li><a href="#work-with-us" className="become-rider-link">GROW YOUR BUSINESS</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="contact-number">
            <a href="tel:0700-1-2525">📞 0700-1-2525</a>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
          </div>

          <div className="copyright">
            © 2025 ByteBites. All Rights Reserved
          </div>
        </div>
      </footer>

      {showLogin && (
        <LoginModal
          close={() => setShowLogin(false)}
          openRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={() => window.location.reload()}
        />
      )}
      {showRegister && <RegisterModal close={() => setShowRegister(false)} role="USER" />}
      {showDeliverRegister && <RegisterModal close={() => setShowDeliverRegister(false)} role="DELIVER" />}
      {showOwnerRegister && <RegisterModal close={() => setShowOwnerRegister(false)} role="OWNER" />}
    </div>
  );
}

export default Home;