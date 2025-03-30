import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/BucketPage.css';

const BucketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, restaurantInfo } = location.state || { cart: [], restaurantInfo: null };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 4.99;
  const serviceFee = 0.15;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee + serviceFee;

  const handleBackToRestaurant = () => {
    navigate(-1);
  };

  const handleProceedToPayment = () => {
    // TODO: Implement payment logic
    console.log('Proceeding to payment...');
  };

  if (!restaurantInfo) {
    return (
      <div className="bucket-empty">
        <h2>Вашата кошница е празна</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Към ресторантите
        </button>
      </div>
    );
  }

  return (
    <div className="bucket-page">
      <div className="bucket-header">
        <button onClick={handleBackToRestaurant} className="back-button">
          ← Назад
        </button>
        <h1>Вашата поръчка</h1>
      </div>

      <div className="bucket-content">
        <div className="restaurant-info">
          <h2>{restaurantInfo.name}</h2>
          <p>{restaurantInfo.address}</p>
        </div>

        <div className="order-items">
          {cart.map((item) => (
            <div key={item.id} className="bucket-item">
              <div className="item-quantity">{item.quantity}x</div>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{(item.price * item.quantity).toFixed(2)} лв.</span>
              </div>
            </div>
          ))}
        </div>

        <div className="price-summary">
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
            <span>{total.toFixed(2)} лв.</span>
          </div>
        </div>

        <button 
          className="payment-button"
          onClick={handleProceedToPayment}
        >
          Продължете към плащане
        </button>
      </div>
    </div>
  );
};

export default BucketPage; 