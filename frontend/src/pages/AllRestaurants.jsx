import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
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

  const categories = ["PIZZA", "PASTA", "BURGER", "SUSHI", "DONER", "SANDWICH"];


  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

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
    <div className="all-restaurants-page">
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

  <div className="main-content-all-rest">
    <aside className="filter-sidebar">
      <h2>Filters</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat}>
            <label className="filter-option">
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
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </label>
          </li>
        ))}
      </ul>
    </aside>

    <section className="restaurants-section-all-rest">
      <h2 className="restaurants-title-all-rest">All restaurants</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="restaurants-grid-all-rest">
        {filteredRestaurants.map((r) => (
          <div
            key={r.id}
            className="restaurant-card-all-rest"
            onClick={() => navigate(`/restaurant/${r.id}`)}
          >
            <img src={r.imageUrl} alt={r.name} className="restaurant-banner-all-rest" />
            <div className="card-overlay-all-rest">
              <div className="emoji-badge">🍽️ {r.menuItems?.length || 12}</div>
            </div>
            <h3 className="restaurant-name-all-rest">{r.name}</h3>
          </div>
        ))}
      </div>
    </section>
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
