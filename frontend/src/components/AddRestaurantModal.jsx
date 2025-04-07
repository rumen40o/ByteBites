import { useState } from "react";
import "../css/Buttons.css"
import {
  addRestaurant
} from '../api/api'

const AddRestaurantModal = ({ isOpen, close, onAddSuccess }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    address: "",
    imageUrl: "" 
  });

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!restaurant.name || !restaurant.description || !restaurant.address || !restaurant.imageUrl) {
      alert("Моля, попълнете всички полета.");
      return;
    }

    try {
      await addRestaurant(restaurant)
      onAddSuccess();
      close();
    } catch (err) {
      console.error("Грешка при добавяне на ресторант:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <button className="close-btn" onClick={close} aria-label="Close">
              <svg className="close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
        <h2>Добави нов ресторант</h2>
        <input
          type="text"
          name="name"
          placeholder="Име"
          value={restaurant.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Описание"
          value={restaurant.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Адрес"
          value={restaurant.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={restaurant.imageUrl}
          onChange={handleChange}
        />
        <button className="submit-btn" onClick={handleSubmit}>Добави</button>
      </div>
    </div>
  );
};

export default AddRestaurantModal;