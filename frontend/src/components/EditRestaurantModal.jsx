
import { useState, useEffect } from "react";
import "../css/EditRestaurantModal.css";
import "../css/Buttons.css";

const EditRestaurantModal = ({ isOpen, onClose, restaurant, onUpdate }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    logoImage: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (restaurant) {
      setForm({
        name:        restaurant.name        || "",
        description: restaurant.description || "",
        address:     restaurant.address     || "",
        imageUrl:   restaurant.imageUrl   || ""
        
      });
    }
  }, [restaurant]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.address || !form.imageUrl) {
      alert("Моля, попълнете всички полета.");
      return;
    }
    try {
      await onUpdate(restaurant.id, form);
      onClose();
    } catch (err) {
      console.error("Грешка при редакция:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <svg className="close-icon-edit" viewBox="0 0 24 24">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        <h2>Edit restaurant</h2>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Restaurant Name"
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Restaurant Description"
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Restaurant Location"
        />
        <input
          type="text"
          name="logoImage"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Logo Image URL"
        />
        
        <button className="edit-submit-btn blue-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
