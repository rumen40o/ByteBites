package com.example.ByteBites.service.inteface;

import com.example.ByteBites.models.Deliveries;
import com.example.ByteBites.models.DeliveryStatus;
import com.example.ByteBites.models.Orders;
import org.springframework.stereotype.Service;

import java.util.List;


public interface DeliveryServiceInterface {
    List<Orders> getAvailableDeliveries();
    String acceptDelivery(Long orderId, Long deliverId);
    String updateDeliveryStatus(Long deliveryId, DeliveryStatus status);
    List<Deliveries> getDeliveriesByDeliver(Long deliverId);
}
