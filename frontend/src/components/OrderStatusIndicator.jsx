import React from 'react';
import '../css/OrderStatusIndicator.css';
import { FaUserCheck } from "react-icons/fa";

const OrderStatusIndicator = ({ status }) => {
  const statuses = [
    { key: 'PENDING', label: 'Проверява се' },
    { key: 'CONFIRMED', label: 'Приготвя се' },
    { key: 'ON_THE_WAY', label: 'На път' },
    { key: 'DELIVERED', label: 'Завършено' }
  ];

  const statusMapping = {
    'ASSIGNED': 'CONFIRMED',
    'IN_PROGRESS': 'ON_THE_WAY',
    'COMPLETED': 'DELIVERED'
  };

  const getStatusIndex = (currentStatus) => {
    const mapped = statusMapping[currentStatus] || currentStatus;
    return statuses.findIndex(s => s.key === mapped);
  };

  const currentStep = getStatusIndex(status);

  return (
    <div className="order-status-wrapper">
      <div className="status-avatar">
        <FaUserCheck className="status-avatar-icon" />
      </div>

      <div className="status-steps">
        {statuses.map((s, index) => (
          <div className={`step ${index <= currentStep ? 'active' : ''}`} key={s.key}>
            <div className="step-circle">{index + 1}</div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="status-progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / statuses.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OrderStatusIndicator;
