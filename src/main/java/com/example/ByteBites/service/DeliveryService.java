package com.example.ByteBites.service;

import com.example.ByteBites.models.*;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.DeliveriesRepository;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.service.inteface.DeliveryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService implements DeliveryServiceInterface {
    private final DeliveriesRepository deliveriesRepository;
    private final OrdersRepository ordersRepository;
    private final AccountRepository accountsRepository;

    public DeliveryService(DeliveriesRepository deliveriesRepository, OrdersRepository ordersRepository, AccountRepository accountsRepository) {
        this.deliveriesRepository = deliveriesRepository;
        this.ordersRepository = ordersRepository;
        this.accountsRepository = accountsRepository;
    }

    @Override
    public List<Orders> getAvailableDeliveries() {
        return ordersRepository.findByStatus(OrderStatus.PENDING);
    }

    @Override
    public String acceptDelivery(Long orderId, Accounts deliver) {
        Optional<Orders> orderOpt = ordersRepository.findById(orderId);

        if (orderOpt.isEmpty()) {
            return "Поръчката не съществува!";
        }

        Orders order = orderOpt.get();

        // Проверка дали вече има доставка за тази поръчка
        if (deliveriesRepository.findByOrder(order).isPresent()) {
            return "Поръчката вече има назначен доставчик!";
        }

        Deliveries delivery = new Deliveries();
        delivery.setOrder(order);
        delivery.setDeliver(deliver);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        deliveriesRepository.save(delivery);

        order.setStatus(OrderStatus.CONFIRMED);
        ordersRepository.save(order);

        return "Успешно приехте поръчката за доставка!";
    }


    @Override
    public String updateDeliveryStatus(Long deliveryId, DeliveryStatus status) {
        Optional<Deliveries> deliveryOpt = deliveriesRepository.findById(deliveryId);

        if (deliveryOpt.isEmpty()) {
            return "Доставката не е намерена!";
        }

        Deliveries delivery = deliveryOpt.get();
        delivery.setStatus(status);

        if (status == DeliveryStatus.COMPLETED) {
            Orders order = delivery.getOrder();
            order.setStatus(OrderStatus.DELIVERED);
            ordersRepository.save(order);
            delivery.setDeliveredAt(LocalDateTime.now().toString());
        }
        if (status == DeliveryStatus.IN_PROGRESS) {
            Orders order = delivery.getOrder();
            order.setStatus(OrderStatus.ON_THE_WAY);
            ordersRepository.save(order);
            delivery.setDeliveredAt(LocalDateTime.now().toString());
        }
        deliveriesRepository.save(delivery);
        return "Статусът на доставката е променен!";
    }

    @Override
    public List<Deliveries> getDeliveriesByDeliver(Long deliverId) {
        Optional<Accounts> deliverOpt = accountsRepository.findById(deliverId);
        return deliverOpt.map(deliveriesRepository::findByDeliver).orElse(null);
    }





}
