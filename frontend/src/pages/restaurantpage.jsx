import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddItemModal from "../components/AddItemModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import "../css/RestaurantPage.css";

const RestaurantPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Взимаме текущия потребител
      const userRes = await axios.get("http://localhost:8080/auth/logged/user", {
        withCredentials: true,
      });
      const currentUser = userRes.data;
      setUser(currentUser);

      // Взимаме информация за ресторанта
      const restaurantRes = await axios.get(`http://localhost:8080/restaurants/${id}`, {
        withCredentials: true,
      });
      const restaurantData = restaurantRes.data;
      setRestaurant(restaurantData);

      
      if (currentUser.role === "OWNER" && restaurantData.owner.id === currentUser.id) {
        setIsOwner(true);
      }

      // Взимаме меню
      loadMenuItems();
    } catch (err) {
      console.error("Грешка при зареждане:", err);
      setError("Проблем при зареждане на информация.");
    }
  };

  const loadMenuItems = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/menu/restaurant/${id}`, {
        withCredentials: true,
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error("Грешка при зареждане на менюто:", err);
      setError("Неуспешно зареждане на менюто.");
    }
  };

  const addToOrder = (item) => {
    const existing = orderItems.find((o) => o.menuItem.id === item.id);
    if (existing) {
      setOrderItems(
        orderItems.map((o) =>
          o.menuItem.id === item.id
            ? { ...o, quantity: o.quantity + 1 }
            : o
        )
      );
    } else {
      setOrderItems([...orderItems, { menuItem: item, quantity: 1 }]);
    }
  };

  const decreaseFromOrder = (itemId) => {
    const existing = orderItems.find((o) => o.menuItem.id === itemId);
    if (!existing) return;

    if (existing.quantity === 1) {
      setOrderItems(orderItems.filter((o) => o.menuItem.id !== itemId));
    } else {
      setOrderItems(
        orderItems.map((o) =>
          o.menuItem.id === itemId
            ? { ...o, quantity: o.quantity - 1 }
            : o
        )
      );
    }
  };

  const handleConfirmOrder = (deliveryAddress) => {
    const orderData = {
      deliveryAddress,
      items: orderItems.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity
      })),
    };

    axios
      .post(
        `http://localhost:8080/orders/create/customer/${user.id}/restaurant/${id}`,
        orderData,
        { withCredentials: true }
      )
      .then(() => {
        alert("Поръчката е създадена успешно!");
        setOrderItems([]);
        setIsAddressModalOpen(false);
      })
      .catch((err) => {
        console.error("Грешка при поръчване:", err);
        setError("Неуспешно създаване на поръчката.");
      });
  };

  return (
    <div className="restaurant-container">
      {restaurant && (
        <div className="restaurant-info">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-banner" />
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <p className="restaurant-description">{restaurant.description}</p>
          <p className="restaurant-address">📍 {restaurant.address}</p>
        </div>
      )}

      <h2>Меню на ресторанта</h2>

      {error && <p className="error-message">{error}</p>}

      {isOwner && (
        <>
          <button onClick={() => setIsModalOpen(true)} className="add-item-button">
            ➕ Edit menu
          </button>

          <AddItemModal
            isOpen={isModalOpen}
            close={() => setIsModalOpen(false)}
            restaurantId={id}
            reloadMenu={loadMenuItems}
          />
        </>
      )}

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <h3>{item.name}</h3>
            <p>Категория: {item.category}</p>
            <p>Цена: {item.price.toFixed(2)} лв</p>
            <button onClick={() => addToOrder(item)}>Добави</button>
          </div>
        ))}
      </div>

      {orderItems.length > 0 && (
        <div className="order-section">
          <h3>Твоята поръчка</h3>
          <ul>
            {orderItems.map((o) => (
              <li key={o.menuItem.id} className="order-item">
                <span>{o.menuItem.name} – {o.quantity} бр.</span>
                <div className="order-buttons">
                  <button onClick={() => decreaseFromOrder(o.menuItem.id)}>−</button>
                  <button onClick={() => addToOrder(o.menuItem)}>+</button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="confirm-button"
          >
            Потвърди поръчката
          </button>
        </div>
      )}

      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
};

export default RestaurantPage;
