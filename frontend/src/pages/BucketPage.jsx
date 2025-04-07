import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BucketPage.css';
import "../css/Buttons.css"
import{
  getCurrentUser,
  createOrder
} from '../api/api';

const BucketPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, restaurantInfo } = location.state || { cart: [], restaurantInfo: { name: 'Restaurant', id: null } };
  const [items, setItems] = useState(cart);
  const [showPayment, setShowPayment] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    street: '',
    number: '',
    details: ''
  });
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [cardErrors, setCardErrors] = useState({});

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

  const handlePaymentSelection = (paymentType) => {
    if (paymentType === 'card') {
      setShowCardModal(true);
    } else {
      setSelectedPayment(paymentType);
    }
  };

  const validateCardInfo = () => {
    const errors = {};
    
    if (!cardInfo.number) {
      errors.number = 'Номерът на картата е задължителен';
    } else {
      const cleanNumber = cardInfo.number.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanNumber)) {
        errors.number = 'Невалиден номер на картата';
      }
    }

    if (!cardInfo.name) {
      errors.name = 'Името на картодържателя е задължително';
    } else {
      const nameRegex = /^[A-Za-zА-Яа-я\s]+$/;
      if (!nameRegex.test(cardInfo.name)) {
        errors.name = 'Името трябва да съдържа само букви';
      } else if (cardInfo.name.length < 2) {
        errors.name = 'Името трябва да е поне 2 символа';
      }
    }

    if (!cardInfo.expiry) {
      errors.expiry = 'Датата на валидност е задължителна';
    } else {
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(cardInfo.expiry)) {
        errors.expiry = 'Невалиден формат (MM/YY)';
      } else {
        const [month, year] = cardInfo.expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        const inputYear = parseInt(year);
        const inputMonth = parseInt(month);

        if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
          errors.expiry = 'Картата е изтекла';
        }
      }
    }

    if (!cardInfo.cvv) {
      errors.cvv = 'CVV кодът е задължителен';
    } else if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
      errors.cvv = 'Невалиден CVV код';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()

        .slice(0, 19); 

    }

    if (field === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    }

    if (field === 'cvv') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4);
    }

    if (field === 'name') {
      formattedValue = value
        .replace(/[^A-Za-zА-Яа-я\s]/g, '')
        .slice(0, 50);
    }

    setCardInfo(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleCardSubmit = () => {
    if (validateCardInfo()) {
      setSelectedPayment('card');
      setShowCardModal(false);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!restaurantInfo?.id) {
        throw new Error("No restaurant ID found");
      }

      const userResponse = await getCurrentUser();
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

      await createOrder(user.id, restaurantInfo.id, orderData);

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
                onClick={() => handlePaymentSelection('card')}
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
                onClick={() => handlePaymentSelection('cash')}
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
              <button className="close-btn" onClick={() => setShowAddressModal(false)} aria-label="Close">
              <svg className="close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
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

      {showCardModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <div className="modal-header">
              <h3>Въведете информация за картата</h3>
              <button className="close-btn" onClick={() => setShowCardModal(false)} aria-label="Close">
              <svg className="close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
            </div>
            <div className="modal-content">
              <div className="card-form-section">
                <div className="card-input-group">
                  <label>Номер на картата <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={cardInfo.number}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={cardErrors.number ? 'error' : ''}
                  />
                  {cardErrors.number && <div className="error-message">{cardErrors.number}</div>}
                </div>
                <div className="card-input-group">
                  <label>Име на картодържателя <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={cardInfo.name}
                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                    placeholder="Въведете име на картодържателя"
                    className={cardErrors.name ? 'error' : ''}
                  />
                  {cardErrors.name && <div className="error-message">{cardErrors.name}</div>}
                </div>
                <div className="card-input-row">
                  <div className="card-input-group">
                    <label>Валидна до <span className="required">*</span></label>
                    <input 
                      type="text" 
                      value={cardInfo.expiry}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      className={cardErrors.expiry ? 'error' : ''}
                    />
                    {cardErrors.expiry && <div className="error-message">{cardErrors.expiry}</div>}
                  </div>
                  <div className="card-input-group">
                    <label>CVV <span className="required">*</span></label>
                    <input 
                      type="text" 
                      value={cardInfo.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      placeholder="123"
                      className={cardErrors.cvv ? 'error' : ''}
                    />
                    {cardErrors.cvv && <div className="error-message">{cardErrors.cvv}</div>}
                  </div>
                </div>
                <div className="card-info">
                  <span className="icon">🔒</span>
                  <p>Вашата информация е защитена и няма да бъде запазена</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowCardModal(false)}>Отказ</button>
              <button 
                className="save-btn" 
                onClick={handleCardSubmit}
                disabled={!cardInfo.name || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvv}
              >
                Продължи
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketPage; 