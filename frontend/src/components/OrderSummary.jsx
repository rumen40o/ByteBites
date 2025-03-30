import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../css/OrderSummary.css';

const OrderSummary = ({ cart, onUpdateQuantity, restaurantInfo }) => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal >= 100 ? 0 : 4.99;
  const serviceFee = 0.15;
  const total = subtotal + deliveryFee + serviceFee;

  const handleQuantityChange = (itemId, newQuantity) => {
    onUpdateQuantity(itemId, Math.max(0, newQuantity));
  };

  const handleCheckout = () => {
    navigate('/bucket', {
      state: {
        cart,
        restaurantInfo
      }
    });
  };

  return (
    <div className="order-summary">
      <h2>Обобщение на поръчката</h2>
      <div className="order-items">
        {cart.map((item) => (
          <div key={item.id} className="order-item">
            <div className="quantity-controls">
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="quantity-btn"
                type="button"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="quantity-btn"
                type="button"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-price">{(item.price * item.quantity).toFixed(2)} лв.</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="order-summary-details">
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
        className="checkout-button"
        type="button"
        onClick={handleCheckout}
      >
        Платете, за да поръчате
      </button>
    </div>
  );
};

OrderSummary.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  restaurantInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderSummary; 