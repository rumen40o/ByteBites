import { useEffect, useState, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";
import AddItemModal from "../components/AddItemModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import OrderSummary from "../components/OrderSummary";
import "../css/RestaurantPage.css";
import Navbar from "../components/Navbar";
import RegisterModal from "../components/RegisterModal";
import EditRestaurantModal from "../components/EditRestaurantModal";
import {
  getCurrentUser,
  getRestaurantById,
  getMenuByRestaurant,
  deleteRestaurant,
  createOrder,
  updateRestaurant,
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
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [isClosingEdit, setIsClosingEdit] = useState(false);
  const editDropdownRef = useRef(null);
  const navigate = useNavigate();
  const editToggleBtnRef = useRef(null);
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
  const [editRestaurantModalOpen, setEditRestaurantModalOpen] = useState(false);
  const [restaurantToEdit, setRestaurantToEdit] = useState(null);


  useEffect(() => {
    loadInitialData();
  }, []);

const handleEditToggle = () => {
  if (showEditDropdown) {
    setIsClosingEdit(true);
    setTimeout(() => {
      setShowEditDropdown(false);
      setIsClosingEdit(false);
    }, 300);
  } else {
    setShowEditDropdown(true);
  }
};

const handleEditMenu = () => {
  setIsModalOpen(true);
  setShowEditDropdown(false);
};

const handleEditRestaurant = () => {
  setRestaurantToEdit(restaurant);
  setEditRestaurantModalOpen(true);
  setShowEditDropdown(false);
};

const handleUpdateRestaurant = async (id, updatedData) => {
  try {
    const res = await updateRestaurant(id, updatedData);
    setRestaurant(res.data);          // обнови текущото състояние
    setEditRestaurantModalOpen(false);
    loadInitialData();                // презареди данните от сървъра
  } catch (err) {
    console.error("Грешка при редакция:", err);
    alert("Неуспешна редакция на ресторанта.");
  }
};


useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      showEditDropdown &&
      editDropdownRef.current &&
      !editDropdownRef.current.contains(e.target) &&
      editToggleBtnRef.current &&
      !editToggleBtnRef.current.contains(e.target)
    ) {
      setIsClosingEdit(true);
      setTimeout(() => {
        setShowEditDropdown(false);
        setIsClosingEdit(false);
      }, 300);
    }
  };
  window.addEventListener("mousedown", handleClickOutside);
  return () => window.removeEventListener("mousedown", handleClickOutside);
}, [showEditDropdown]);


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
          <p className="restaurant-address-tag">
            <svg
              width="24px"
              height="18px"
              viewBox="3 0 24 24"
              fill="none"
              stroke="var(--wfont-color)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 1 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {restaurant?.address}</p>
        </div>
      </div>
      <div className="restaurant-content-wrapper">
        <div className="restaurant-menu-section">
        {isOwner && (
  <div className="restaurant-actions" style={{ position: "relative" }}>
    <button
      ref={editToggleBtnRef}
      onClick={handleEditToggle}
      className="green-btn"
    >
      Edit
      {(showEditDropdown || isClosingEdit) && (
      <div
        ref={editDropdownRef}
        className={`dropdown-menu ${isClosingEdit ? "closing" : ""}`}
        style={{
          position: "absolute",
          top: "calc(100% + 0.5rem)",
          zIndex: 10
        }}
        
      >
        <button onClick={handleEditMenu}>Menu</button>
        <button onClick={handleEditRestaurant}>Restaurant</button>
      </div>
    )}
    </button>

    
          <button className="blue-btn" onClick={(e) => { e.stopPropagation();}}>Report</button>
          <button className="orange-btn" onClick={(e) => handleOrdersClick(restaurant, e)}>Orders</button>
          <button className="red-btn" onClick={(e) => { e.stopPropagation(); handleDelete(restaurant.id); }}>Delete</button>
        </div>  
      )}
          {Object.keys(groupedMenu).map((category) => (
            <div key={category} className="menu-category-section">
              <h2 className="menu-category-title">{category}</h2>
              <div className="menu-grid">
                {groupedMenu[category].map((item) => (
                  <div key={item.id} className="menu-item" onClick={() => addToOrder(item)}>
                    <div className="image-container">
                      <img
                      src={item.foodImage || image}
                      alt={item.name}
                      className="menu-item-image"
                      onError={e => { e.currentTarget.src = image }}
                    />
                    
                    </div>
                    <div className="menu-item-text">
                    <h3 className="menu-item-name">
                      {item.name}
                      <button
                        className="add-item-btn"
                      >
                        <svg className="add-item-icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5"  y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </h3>
                      <p className="menu-item-description">
                        {item.description || "No description."}
                      </p>
                      <p className="menu-item-price">{item.price.toFixed(2)} лв.</p>
                    </div>
                    <div className="add-item-container">
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
      
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>⬆</button>
        {isOwner && (
  <EditRestaurantModal
    isOpen={editRestaurantModalOpen}
    onClose={() => setEditRestaurantModalOpen(false)}
    restaurant={restaurantToEdit}
    onUpdate={handleUpdateRestaurant}
  />
)}
        
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


