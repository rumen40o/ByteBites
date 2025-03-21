package com.example.ByteBites.service;

import com.example.ByteBites.models.*;
import com.example.ByteBites.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrdersRepository ordersRepository;
    private final AccountRepository accountsRepository;
    private final RestaurantsRepository restaurantsRepository;
    private final MenuItemsRepository menuItemsRepository;
    private final OrderItemsRepository orderItemsRepository;

    @Transactional
    public Orders createOrder(Long customerId, Long restaurantId, List<OrderItems> orderItemsList) {
        Accounts customer = accountsRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Клиентът не е намерен!"));

        Restaurants restaurant = restaurantsRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Ресторантът не е намерен!"));

        Orders order = new Orders();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setStatus(OrderStatus.PENDING);

        double totalPrice = 0;
        for (OrderItems item : orderItemsList) {
            MenuItems menuItem = menuItemsRepository.findById(item.getMenuItem().getId())
                    .orElseThrow(() -> new RuntimeException("Меню артикулът не е намерен!"));

            totalPrice += menuItem.getPrice() * item.getQuantity();
        }

        order.setTotalPrice(totalPrice);

        Orders savedOrder = ordersRepository.save(order);

        for (OrderItems item : orderItemsList) {
            item.setOrder(savedOrder);
            orderItemsRepository.save(item);
        }

        return savedOrder;
    }
    
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }


    public List<Orders> getOrdersByCustomer(Long customerId) {
        Accounts customer = accountsRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Клиентът не е намерен!"));

        return ordersRepository.findByCustomer(customer);
    }


    public Orders updateOrderStatus(Long orderId, OrderStatus status) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Поръчката не е намерена!"));

        order.setStatus(status);
        return ordersRepository.save(order);
    }


    public void deleteOrder(Long orderId) {
        if (!ordersRepository.existsById(orderId)) {
            throw new RuntimeException("Поръчката не е намерена!");
        }
        ordersRepository.deleteById(orderId);
    }

    public List<OrderItems> getOrderItemsByOrder(Long orderId) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Поръчката не е намерена!"));

        return orderItemsRepository.findByOrder(order);
    }
}

