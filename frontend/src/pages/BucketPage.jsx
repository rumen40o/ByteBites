import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BucketPage.css';
import axios from 'axios';

const BucketPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, restaurantInfo } = location.state || { cart: [], restaurantInfo: { name: 'Restaurant', id: null } };
  const [items, setItems] = useState(cart);
  const [showPayment, setShowPayment] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    street: '',
    number: '',
    details: ''
  });

  useEffect(() => {
    if (!restaurantInfo?.id) {
      console.error("No restaurant ID found in location state");
      navigate('/');
    }
  }, [restaurantInfo, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleQuantityChange = (itemId, change) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleSaveAddress = () => {
    if (tempAddress.street && tempAddress.number) {
      const formattedAddress = `${tempAddress.street}, ${tempAddress.number}${tempAddress.details ? `, ${tempAddress.details}` : ''}`;
      setSelectedAddress(formattedAddress);
      setShowAddressModal(false);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!restaurantInfo?.id) {
        throw new Error("No restaurant ID found");
      }

      const userResponse = await axios.get("http://localhost:8080/auth/logged/user", { withCredentials: true });
      const user = userResponse.data;

      if (!user) {
        throw new Error("User not logged in");
      }

      const orderData = {
        deliveryAddress: selectedAddress,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      };

      await axios.post(
        `http://localhost:8080/orders/create/customer/${user.id}/restaurant/${restaurantInfo.id}`,
        orderData,
        { withCredentials: true }
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Грешка при създаване на поръчката. Моля, опитайте отново.");
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 100 ? 0 : 4.99;
  const serviceFee = 0.15;
  const visualTotal = subtotal + deliveryFee + serviceFee;

  console.log(subtotal);

  if (!items || items.length === 0) {
    return (
      <div className="bucket-empty">
        <h2>Вашата количка е празна</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Разгледайте ресторанти
        </button>
      </div>
    );
  }

  return (
    <div className="bucket-page">
      <div className="bucket-header">
        <button onClick={handleBackClick} className="back-button">
          ← Обобщение на поръчката
        </button>
        <h1>{restaurantInfo.name}</h1>
      </div>

      <div className="order-content">
        <div className="main-section">
          <div className="order-count">
            {items.length} продукта от {restaurantInfo.name}
          </div>

          <div className="order-items">
            {items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >−</button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >+</button>
                </div>
                <div className="item-name">{item.name}</div>
                <div className="item-price">{(item.price * item.quantity).toFixed(2)} лв.</div>
              </div>
            ))}
          </div>

          <div className="delivery-section">
            <h2>Информация за доставката</h2>
            <div className="map-container">
              {/* Map will be implemented here */}
            </div>
            {selectedAddress ? (
              <div className="address-row" onClick={() => setShowAddressModal(true)}>
                <div className="address-content">
                  <span className="icon">📍</span>
                  <div className="address-details">
                    <div className="address-main">{selectedAddress}</div>
                  </div>
                </div>
                <div className="address-actions">
                  <button className="edit-btn">Промяна</button>
                  <button className="remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAddress(null);
                  }}>Премахни</button>
                </div>
              </div>
            ) : (
              <div className="address-row add-address" onClick={() => setShowAddressModal(true)}>
                <div className="address-content">
                  <span className="icon">📍</span>
                  <div className="address-details">
                    <div className="address-main">Добавете адрес за доставка</div>
                  </div>
                </div>
                <button className="add-btn">Добави</button>
              </div>
            )}
          </div>

          <div className="delivery-time">
            <div className="time-box">
              <span className="time">20-30 мин.</span>
              <span className="time-label">Възможно най-скоро</span>
            </div>
          </div>

          <div className="payment-section">
            <h2>Начин на плащане</h2>
            <div className="payment-options">
              <div 
                className={`payment-option ${selectedPayment === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment(selectedPayment === 'card' ? null : 'card')}
              >
                <div className="payment-option-content">
                  <span className="icon">💳</span>
                  <div className="payment-details">
                    <div className="payment-title">Плащане с карта</div>
                    <div className="payment-subtitle">Visa, Mastercard, и др.</div>
                  </div>
                </div>
                <div className="payment-check">
                  {selectedPayment === 'card' && <span>✓</span>}
                </div>
              </div>

              <div 
                className={`payment-option ${selectedPayment === 'cash' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment(selectedPayment === 'cash' ? null : 'cash')}
              >
                <div className="payment-option-content">
                  <span className="icon">💵</span>
                  <div className="payment-details">
                    <div className="payment-title">Плащане в брой</div>
                    <div className="payment-subtitle">При доставка</div>
                  </div>
                </div>
                <div className="payment-check">
                  {selectedPayment === 'cash' && <span>✓</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <div className="summary-header">
            <h2>Обобщение</h2>
            <span className="icon">🍔</span>
          </div>
          <div className="summary-row">
            <span>Продукти</span>
            <span>{subtotal.toFixed(2)} лв.</span>
          </div>
          <div className="summary-row">
            <span>Доставка</span>
            <span>{deliveryFee.toFixed(2)} лв.</span>
          </div>
          <div className="summary-row">
            <span>Такса за услуга</span>
            <span>{serviceFee.toFixed(2)} лв.</span>
          </div>
          <div className="summary-row total">
            <span>ОБЩО</span>
            <span>{visualTotal.toFixed(2)} лв.</span>
          </div>
          <button 
            className="checkout-button"
            onClick={handleCheckout}
            disabled={!selectedAddress || !selectedPayment}
          >
            {selectedPayment === 'cash' ? 'Поръчайте сега' : 'Платете, за да поръчате'}
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h2>Поръчката е успешна!</h2>
              <p>Вашата поръчка е на път.</p>
              <button className="track-button" onClick={() => navigate('/order-tracking')}>
                Статус на поръчката
              </button>
              <button 
                className="close-success-btn" 
                onClick={() => setShowSuccessModal(false)}
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <div className="modal-header">
              <h3>{selectedAddress ? 'Променете адрес за доставка' : 'Добавете адрес за доставка'}</h3>
              <button className="close-btn" onClick={() => setShowAddressModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="address-input-group">
                <label>Улица <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={tempAddress.street}
                  onChange={(e) => setTempAddress({...tempAddress, street: e.target.value})}
                  placeholder="Въведете име на улица"
                />
              </div>
              <div className="address-input-group">
                <label>Номер <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={tempAddress.number}
                  onChange={(e) => setTempAddress({...tempAddress, number: e.target.value})}
                  placeholder="Въведете номер"
                />
              </div>
              <div className="address-input-group">
                <label>Допълнителни детайли</label>
                <input 
                  type="text" 
                  value={tempAddress.details}
                  onChange={(e) => setTempAddress({...tempAddress, details: e.target.value})}
                  placeholder="Етаж, апартамент, вход и т.н."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddressModal(false)}>Отказ</button>
              <button 
                className="save-btn" 
                onClick={handleSaveAddress}
                disabled={!tempAddress.street || !tempAddress.number}
              >
                Запази
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketPage; 