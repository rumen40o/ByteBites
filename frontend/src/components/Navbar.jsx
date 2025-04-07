import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import logo from "../images/ByteBitesLogoHorizontal.png";
import "../css/home.css";
import { getCurrentUser, logoutUser } from "../api/api";
import AddRestaurantModal from "./AddRestaurantModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setMenuOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLogoClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleAddRestaurant = () => {
    <AddRestaurantModal/>
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img
            src={logo}
            alt="ByteBites Logo"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />

          <div className="header-btn-content">
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
                    onClick={() => setShowAddModal(true)}
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
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/order-tracking")}
                    >
                      Order Status
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
              <div className="header-btn">
                <button className="white-btn" onClick={() => setShowLogin(true)}>
                  Log in
                </button>
                <button className="white-btn" onClick={() => setShowRegister(true)}>
                  Create Account
                </button>

                {/* 🌐 Езиков бутон със стария SVG */}
                <button className="globe-btn">
                  <svg className="globe-icon" viewBox="0 1 20 20" xmlns="http://www.w3.org/2000/svg">
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(2 3)"
                    >
                      <path d="m8 16c4.4380025 0 8-3.5262833 8-7.96428571 0-4.43800246-3.5619975-8.03571429-8-8.03571429-4.43800245 0-8 3.59771183-8 8.03571429 0 4.43800241 3.56199755 7.96428571 8 7.96428571z" />
                      <path d="m1 5h14" />
                      <path d="m1 11h14" />
                      <path d="m8 16c2.2190012 0 4-3.5262833 4-7.96428571 0-4.43800246-1.7809988-8.03571429-4-8.03571429-2.21900123 0-4 3.59771183-4 8.03571429 0 4.43800241 1.78099877 7.96428571 4 7.96428571z" />
                    </g>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

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
      <AddRestaurantModal
        isOpen={showAddModal}
        close={() => setShowAddModal(false)}
        onAddSuccess={() => window.location.reload()}
      />

    </>
  );
};

export default Navbar;
