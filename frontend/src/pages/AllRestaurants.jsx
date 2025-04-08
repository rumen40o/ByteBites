import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AllRestaurants.css";

import {
  getAllRestaurants,
  getCurrentUser,
  logoutUser,
  filterRestaurantsByCategories,
} from "../api/api";

import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import AddRestaurantModal from "../components/AddRestaurantModal";
import Navbar from "../components/Navbar";

const AllRestaurants = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
const [allRestaurants, setAllRestaurants] = useState([]);


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
      setUser(null);
    }
  };

  const loadRestaurants = async () => {
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data);
      setAllRestaurants(res.data);
    } catch (err) {
      setError("Неуспешно зареждане на ресторантите.");
    }
  };

  const filterByCategories = async (cats) => {
    try {
      const res = await filterRestaurantsByCategories(cats);
      setRestaurants(res.data);
    } catch (err) {
      console.error("Грешка при филтриране:", err);
      setError("Неуспешно филтриране.");
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="restaurants-container">
      <Navbar
        user={user}
        setUser={setUser}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
        onAddRestaurant={() => setShowAddModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} 
        allRestaurants={restaurants}
      />

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
                  prev.includes(value)
                    ? prev.filter((c) => c !== value)
                    : [...prev, value]
                );
              }}
            />
            {cat}
          </label>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="restaurants-grid">
        {filteredRestaurants.map((r) => (
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

      {/* 🔐 Модали */}
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
          role="USER"
        />
      )}
      {user?.role === "OWNER" && (
        <AddRestaurantModal
          isOpen={showAddModal}
          close={() => setShowAddModal(false)}
          onAddSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default AllRestaurants;
