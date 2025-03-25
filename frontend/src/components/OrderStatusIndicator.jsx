import React from 'react';
import '../css/OrderStatusIndicator.css';

const OrderStatusIndicator = ({ status }) => {
  const statuses = [
    { key: 'PENDING', label: 'Проверява се' },
    { key: 'CONFIRMED', label: 'Приготвя се' },
    { key: 'ON_THE_WAY', label: 'На път' },
    { key: 'DELIVERED', label: 'Завършено' }
  ];

  const getStatusIndex = (currentStatus) => {
    return statuses.findIndex(s => s.key === currentStatus);
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="order-status-indicator">
      <div className="status-circle">
        {statuses.map((s, index) => (
          <div
            key={s.key}
            className={`status-segment ${index <= currentIndex ? 'active' : ''} status-${s.key.toLowerCase()}`}
            style={{
              transform: `rotate(${index * 90}deg)`
            }}
          />
        ))}
        <div className="status-center">
          <span className="status-label">{statuses[currentIndex]?.label || 'Неизвестен'}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusIndicator; 