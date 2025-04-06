import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AllRestaurants.css";
import {
  getAllRestaurants,
  getCurrentUser,
  logoutUser,
  filterRestaurantsByCategories,
} from "../api/api";

import {
  FaUserCircle,
  FaGlobe,
} from "react-icons/fa";

import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import AddRestaurantModal from "../components/AddRestaurantModal";
import logo from "../images/ByteBitesLogoHorizontal.png";

const AllRestaurants = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = ["PIZZA", "PASTA", "BURGER", "SUSHI", "RAMEN", "SANDWICH"];

  useEffect(() => {
    fetchUser();
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      loadRestaurants();
    } else {
      filterByCategories(selectedCategories);
    }
  }, [selectedCategories]);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (err) {
      setUser(null); // ако не е логнат, просто няма user
    }
  };

  const loadRestaurants = async () => {
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data);
    } catch (err) {
      console.error("Грешка при зареждане на ресторанти:", err);
      setError("Неуспешно зареждане на ресторантите.");
    }
  };

  const filterByCategories = async (cats) => {
    try {
      const res = await  filterRestaurantsByCategories(cats);
      setRestaurants(res.data);
    } catch (err) {
      console.error("Грешка при филтриране:", err);
      setError("Неуспешно филтриране.");
    }
  };

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

  return (
    <div className="restaurants-container">
      <header className="header">
        <div className="header-content">
          <img src={logo} alt="ByteBites Logo" className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }} />

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
              <>
                <button className="btn btn-login" onClick={() => setShowLogin(true)}>
                  Log in
                </button>
                <button className="btn btn-create-account" onClick={() => setShowRegister(true)}>
                  Create Account
                </button>
                <button className="language-selector">
                  <FaGlobe />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <h2 className="restaurants-title">Всички ресторанти</h2>

      {/* 🔍 Филтри */}
      <div className="category-filters">
        {categories.map((cat) => (
          <label key={cat} className="filter-label">
            <input
              type="checkbox"
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategories((prev) =>
                  prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
                );
              }}
            />
            {cat}
          </label>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="restaurants-grid">
        {restaurants.map((r) => (
          <div
            key={r.id}
            className="restaurant-card cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/restaurant/${r.id}`)}
          >
            <img src={r.imageUrl} alt={r.name} className="restaurant-image" />
            <h3 className="restaurant-name">{r.name}</h3>
            <p className="restaurant-description">{r.description}</p>
            <p className="restaurant-address">{r.address}</p>
          </div>
        ))}
      </div>

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
      <AddRestaurantModal
        isOpen={showAddModal}
        close={() => setShowAddModal(false)}
        onAddSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default AllRestaurants;
