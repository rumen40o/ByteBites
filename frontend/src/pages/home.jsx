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

          <div className="header-btn-content">
            {user ? (
              <div className="relative">
                <button
                  className="text-5xl text-gray-700 hover:text-gray-900 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                > <FaUserCircle/>
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
                    <button
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
              <div className="header-btn">
              <button className="white-btn" onClick={() => setShowLogin(true)}>
                  Log in
                </button>
                <button className="white-btn" onClick={() => setShowRegister(true)}>
                  Create Account
                </button>
                <button className="white-btn" onClick={() => document.getElementById('work-with-us').scrollIntoView({ behavior: 'smooth' })}>
                  Work with us
                </button>
                <button className="globe-btn">
                <svg className="globe-icon" viewBox="0 1 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)"><path d="m8 16c4.4380025 0 8-3.5262833 8-7.96428571 0-4.43800246-3.5619975-8.03571429-8-8.03571429-4.43800245 0-8 3.59771183-8 8.03571429 0 4.43800241 3.56199755 7.96428571 8 7.96428571z"/><path d="m1 5h14"/><path d="m1 11h14"/><path d="m8 16c2.2190012 0 4-3.5262833 4-7.96428571 0-4.43800246-1.7809988-8.03571429-4-8.03571429-2.21900123 0-4 3.59771183-4 8.03571429 0 4.43800241 1.78099877 7.96428571 4 7.96428571z"/></g></svg>
                </button>
              </div>
              </>
            )}
          </div>
        </div>
      </header>
      <img src={sushiBoard} alt="" className="background-img sushi-board" />
      <img src={burgerDecor} alt="" className="background-img burger" />
      <main className="page-container">
        <section className="hero-section">
          <h9 className="hero-title">Welcome to ByteBites</h9>
          <p className="hero-subtitle">
            ByteBites is a delicious service offering a unique experience
            that helps you satisfy your hunger.
          </p>
          <button className="blue-btn"
            onClick={() => navigate("/restaurants")}
          >
            SEARCH ALL RESTAURANTS
          </button>
        </section>

        <div className="content-container">
          <section className="food-types">
            <h1 className="section-title">TYPES OF FOOD</h1>
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
                <p1>Share your location</p1>
              </div>
              <div className="order-step">
                <div className="step-icon">
                  <FaHamburger />
                </div>
                <p1>Choose your food</p1>
              </div>
              <div className="order-step">
                <div className="step-icon">
                  <FaTruck />
                </div>
                <p1>Order and track </p1>
              </div>
            </div>
          </section>

          <section className="work-with-us" id="work-with-us">
            <h3 className="section-title">WANT TO WORK WITH US?</h3>
            <div className="opportunities">
              <div className="opportunity-card">
                <div className="opportunity-image">
                  <img src={handshake} alt="Restaurant interior" />
                </div>
                <p className="opportunity-text">
                  ByteBytes provides an opportunity for any restaurant-related business to expand its operations in the online space.
                </p>
                <button className="white-btn" onClick={() => setShowOwnerRegister(true)}>
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
                <button className="white-btn" onClick={() => setShowDeliverRegister(true)}>
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
            <h3>USEFUL INFORMATION</h3>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="contact-number">
            <a href="tel:+359 87 969 6969">📞 +359 87 969 6969</a>
          </div>

          <div className="social-links">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
          </div>

          <div className="footer-btn">
            <ul>
                <li><a href="#">About us</a> <a href="#">Terms & Conditions</a> <a href="#">Privacy policy</a></li>
              </ul>
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
          onLoginSuccess={() => {
            setShowLogin(false);
            window.location.reload();
          }}
        />
      )}

        {showRegister && (
          <RegisterModal
            close={() => setShowRegister(false)}
            openLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            role="USER"
          />
        )}
        {showDeliverRegister && <RegisterModal close={() => setShowDeliverRegister(false)} role="DELIVER" />}
        {showOwnerRegister && <RegisterModal close={() => setShowOwnerRegister(false)} role="OWNER" />}
    </div>
  );
}

export default Home;