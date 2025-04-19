// components/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  getRestaurantsByOwner,
  deleteRestaurant,
  updateRestaurant
} from "../api/api";
import { useNavigate } from "react-router-dom";
import EditRestaurantModal from "./EditRestaurantModal";
import "../css/OwnerDashboard.css";
import AddRestaurantModal from "./AddRestaurantModal";
import OrderPopup from "../components/OrderPopup";

const OwnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [orderPopupOpen, setOrderPopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRestaurants = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);

        if (res.data.role === "OWNER") {
          const restaurantRes = await getRestaurantsByOwner(res.data.id);
          setRestaurants(restaurantRes.data);
        }
      } catch (err) {
        setError("Грешка при зареждане на потребителя или ресторантите.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRestaurants();
  }, []);

  const handleDelete = async (restaurantId) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този ресторант?")) return;

    try {
      await deleteRestaurant(restaurantId);
      setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
      alert("Ресторантът беше успешно изтрит!");
    } catch (err) {
      console.error("Грешка при изтриване:", err);
      alert("Възникна грешка при изтриването на ресторанта.");
    }
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await updateRestaurant(id, updatedData);
      setRestaurants(prev =>
        prev.map(r => (r.id === id ? res.data : r))
      );
    } catch (err) {
      console.error("Грешка при редакция:", err);
    }
  };

  const handleOrdersClick = (restaurant, e) => {
    e.stopPropagation();
    e.preventDefault();
    setOrderPopupOpen(true);
    setSelectedRestaurant(restaurant);
  };

  if (loading) return <div className="text-center mt-10">Зареждане...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  

  return (
    <div className="owner-dashboard">
        <div className="owner-texts-container">
      <h1 className="owner-greeting">
        Hello mr. <span className="owner-name">{user?.username?.toUpperCase()}</span>
      </h1>
      <p className="owner-subtitle">THIS IS YOUR RESTAURANTS MANAGEMENT HOME PAGE!</p>
      </div>
      <button className="add-restaurant-btn" onClick={() => setAddModalOpen(true)}>
      <span className="add-icon-owner">＋</span>Add restaurant
        </button>
    
      {restaurants.length === 0 ? (
        <p>Нямате добавени ресторанти.</p>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <div className="restaurant-overlay">

                <div className="restaurant-info">
                  <p className="location">📍 {restaurant.address}</p>
                  <h3>{restaurant.name}</h3>
                </div>
                <div className="restaurant-actions">
                  <button className="btn-blue" onClick={(e) => { e.stopPropagation(); /* add logic */ }}>Report</button>
                  <button className="btn-green" onClick={(e) => { e.stopPropagation(); handleEdit(restaurant); }}>Edit</button>
                  <button className="btn-orange" onClick={(e) => handleOrdersClick(restaurant, e)}>Orders</button>
                  <button className="btn-red" onClick={(e) => { e.stopPropagation(); handleDelete(restaurant.id); }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditRestaurantModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        restaurant={selectedRestaurant}
        onUpdate={handleUpdate}
      />

    <AddRestaurantModal
        isOpen={addModalOpen}
        close={() => setAddModalOpen(false)}
        onAddSuccess={() => {
            setAddModalOpen(false);
            getRestaurantsByOwner(user.id).then(res => setRestaurants(res.data));
          }}
      />
      

      {orderPopupOpen && selectedRestaurant && (
  <OrderPopup id={selectedRestaurant.id} onClose={() => setOrderPopupOpen(false)} />
)}
    </div>
  );
};

export default OwnerDashboard;
