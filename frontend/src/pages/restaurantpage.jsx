import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddItemModal from "../components/AddItemModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import OrderSummary from "../components/OrderSummary";
import "../css/RestaurantPage.css";

const RestaurantPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
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

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      const existingItem = cart.find(item => item.id === itemId);
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
  };

  const addToOrder = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }]);
    }
  };

  const handleConfirmOrder = (deliveryAddress) => {
    const orderData = {
      deliveryAddress,
      items: cart.map((item) => ({
        menuItemId: item.id,
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
        setCart([]);
        setIsAddressModalOpen(false);
      })
      .catch((err) => {
        console.error("Грешка при поръчване:", err);
        setError("Неуспешно създаване на поръчката.");
      });
  };

  return (
    <div className="restaurant-container">
      <div className="content-section">
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
      </div>

      <div className="order-section">
        {cart.length > 0 && restaurant && (
          <OrderSummary 
            cart={cart}
            onUpdateQuantity={updateQuantity}
            restaurantInfo={{
              name: restaurant.name,
              address: restaurant.address,
              id: restaurant.id
            }}
          />
        )}
      </div>

      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
};

export default RestaurantPage;
