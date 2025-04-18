import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddItemModal from "../components/AddItemModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import OrderSummary from "../components/OrderSummary";
import "../css/RestaurantPage.css";
import Navbar from "../components/Navbar";
import RegisterModal from "../components/RegisterModal";
import {
  getCurrentUser,
  getRestaurantById,
  getMenuByRestaurant,
  deleteRestaurant,
  createOrder,
} from '../api/api';
import LoginModal from "../components/LoginModal";
import Footer from "../components/Footer";
import "../css/Buttons.css";
import image from'../images/pizza-1.png';
import OrderPopup from "../components/OrderPopup";

const RestaurantPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
   const [restaurants, setRestaurants] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [orderPopupOpen, setOrderPopupOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setShowLogin(false);
  };

  const loadInitialData = async () => {
    
      let currentUser = null;

    try {
      const userRes = await getCurrentUser();
      currentUser = userRes.data;
      setUser(currentUser);
    } catch (e) {
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
        foodImage: item.foodImage,
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

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

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

    const handleOrdersClick = (restaurant, e) => {
      e.stopPropagation();
      e.preventDefault();
      setOrderPopupOpen(true);
      setSelectedRestaurant(restaurant);
    };

  return (
    
    <div className="restaurant-container">
    <Navbar onLoginClick={() => setShowLogin(true)} onRegisterClick={() => setShowRegister(true)} />
  
    <div className="restaurant-banner-section">
      <img src={restaurant?.imageUrl} alt={restaurant?.name} className="restaurant-banner" />
      <div className="restaurant-banner-overlay">
        <h1 className="restaurant-title">{restaurant?.name}</h1>
        <p className="restaurant-subtitle">{restaurant?.description}</p>
        <p className="restaurant-address-tag">📍 {restaurant?.address}</p>
      </div>
    </div>
    {isOwner && (
         <div className="restaurant-actions">
            <button onClick={() => setIsModalOpen(true)} className="btn-green">
              Edit
            </button>

            <AddItemModal
              isOpen={isModalOpen}
              close={() => setIsModalOpen(false)}
              restaurantId={id}
              reloadMenu={loadMenuItems}
            />
          <button className="btn-blue" onClick={(e) => { e.stopPropagation(); /* add logic */ }}>Report</button>
          <button className="btn-orange" onClick={(e) => handleOrdersClick(restaurant, e)}>Orders</button>
          <button className="btn-red" onClick={(e) => { e.stopPropagation(); handleDelete(restaurant.id); }}>Delete</button>
        </div>
          
        )}
  
    <div className="restaurant-content-wrapper">
      {/* Menu */}
      <div className="restaurant-menu-section">
        {Object.keys(groupedMenu).map((category) => (
          <div key={category} className="menu-category-section">
            <h2 className="menu-category-title">{category}</h2>
            <div className="menu-grid">
              {groupedMenu[category].map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="image-container">
                      <img
                      src={item.foodImage || image}
                      alt={item.name}
                      className="menu-item-image"
                      onError={e => { e.currentTarget.src = image }}
                    />
                  </div>
                  <div className="menu-item-text">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <p className="menu-item-description">
                      {item.description || "No description."}
                    </p>
                    
                  </div>
                  <div className="add-item-container">
                  <p className="menu-item-price">{item.price.toFixed(2)} лв.</p>
                      <button className="circle-add-item-btn" onClick={() => addToOrder(item)}>
                        <span className="circle-icon-add-item">+</span>
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  
      {/* Cart */}
      <div className="restaurant-cart-section">
        <OrderSummary
          cart={orderItems}
          onUpdateQuantity={updateQuantity}
          restaurantInfo={{
            name: restaurant?.name,
            address: restaurant?.address,
            id: restaurant?.id,
          }}
          user={user}
          onLoginRequired={() => setShowLoginModal(true)}
        />
      </div>
    </div>
  
    {/* Footer + Modals + Scroll Up */}
    <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>⬆</button>
    <Footer />
  
    {showLogin && <LoginModal close={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} openRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
    {showRegister && <RegisterModal close={() => setShowRegister(false)} openLogin={() => { setShowRegister(false); setShowLogin(true); }} role="USER" />}
    {isOwner && <AddItemModal isOpen={isModalOpen} close={() => setIsModalOpen(false)} restaurantId={id} reloadMenu={loadMenuItems} />}
    <DeliveryAddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} onConfirm={handleConfirmOrder} />
    {showLoginModal && <LoginModal close={() => setShowLoginModal(false)} onLoginSuccess={() => window.location.reload()} />}
    {orderPopupOpen && selectedRestaurant && (
  <OrderPopup id={selectedRestaurant.id} onClose={() => setOrderPopupOpen(false)} />
)}
  </div>
  
  );
  
};

export default RestaurantPage;


