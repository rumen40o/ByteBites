import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddItemModal from "../components/AddItemModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import OrderSummary from "../components/OrderSummary";
import "../css/RestaurantPage.css";
import {
  getCurrentUser,
  getRestaurantById,
  getMenuByRestaurant,
  createOrder,
} from '../api/api';
import LoginModal from "../components/LoginModal";

const RestaurantPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    
      let currentUser = null;

    try {
      const userRes = await getCurrentUser();
      currentUser = userRes.data;
      setUser(currentUser);
    } catch (e) {
      // Не е логнат
      setUser(null);
    }
    try {
      const restaurantRes = await getRestaurantById(id)
      const restaurantData = restaurantRes.data;
      setRestaurant(restaurantData);

      if (
        currentUser?.role === "OWNER" &&
        restaurantData?.owner &&
        restaurantData.owner.id === currentUser.id
      ) {
        setIsOwner(true);
      }

      loadMenuItems();
    } catch (err) {
      console.error("Грешка при зареждане:", err);
      setError("Проблем при зареждане на информация.");
    }
  };

  const loadMenuItems = async () => {
    try {
      const res = await getMenuByRestaurant(id)

      if (Array.isArray(res.data)) {
        setMenuItems(res.data);
      } else {
        console.warn("⚠ Менюто не е масив! Получено:", res.data);
        setMenuItems([]);
      }
    } catch (err) {
      console.error("Грешка при зареждане на менюто:", err);
      setError("Неуспешно зареждане на менюто.");
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setOrderItems(orderItems.filter(item => item.id !== itemId));
    } else {
      const existingItem = orderItems.find(item => item.id === itemId);
      if (existingItem) {
        setOrderItems(orderItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
  };

  const addToOrder = (item) => {
    const existingItem = orderItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setOrderItems([...orderItems, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }]);
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
        quantity: item.quantity,
      })),
    };

    createOrder(user.id, id, orderItems)
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
        {orderItems.length > 0 && restaurant && (
          <OrderSummary 
          cart={orderItems}
          onUpdateQuantity={updateQuantity}
          restaurantInfo={{
            name: restaurant.name,
            address: restaurant.address,
            id: restaurant.id
          }}
          user={user}
          onLoginRequired={() => setShowLoginModal(true)}
        />
        )}
      </div>
      
      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />

      {showLoginModal && (
        <LoginModal
          close={() => setShowLoginModal(false)}
          openRegister={() => {
            setShowLoginModal(false);
          }}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default RestaurantPage;
