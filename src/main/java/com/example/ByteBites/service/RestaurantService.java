package com.example.ByteBites.service;


import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.RestaurantRequestDTO;
import com.example.ByteBites.models.Orders;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.MenuItemsRepository;
import com.example.ByteBites.repository.OrderItemsRepository;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.service.inteface.RestaurantServiceInterface;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService implements RestaurantServiceInterface {

    private final RestaurantsRepository restaurantsRepository;
    private final OrdersRepository ordersRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final MenuItemsRepository menuItemsRepository;

    public RestaurantService(RestaurantsRepository restaurantsRepository, OrdersRepository ordersRepository, OrderItemsRepository orderItemsRepository, MenuItemsRepository menuItemsRepository) {
        this.restaurantsRepository = restaurantsRepository;
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.menuItemsRepository = menuItemsRepository;
    }


    // Създаване на ресторант
    public Restaurants createRestaurant(RestaurantRequestDTO dto, Accounts currentUser) {
        Restaurants restaurant = new Restaurants();
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setImageUrl(dto.getImageUrl());
        restaurant.setOwner(currentUser);
        return restaurantsRepository.save(restaurant);
    }

    // Връща всички ресторанти
    public List<Restaurants> getAllRestaurants() {
        return restaurantsRepository.findAll();
    }

    // Връща ресторант по ID
    public Optional<Restaurants> getRestaurantById(Long id) {
        return restaurantsRepository.findById(id);
    }

    // Обновяване
    public Restaurants updateRestaurant(Long id, RestaurantRequestDTO dto,Accounts currentUser) {
        Restaurants restaurant = restaurantsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ресторантът не е намерен!"));

        if (!restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Нямате права да редактирате този ресторант!");
        }

        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setImageUrl(dto.getImageUrl());

        return restaurantsRepository.save(restaurant);
    }

    // Изтриване
    @Transactional
    public void deleteRestaurant(Long id, Accounts currentUser) {
        Restaurants restaurant = restaurantsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ресторантът не е намерен!"));

        // ✅ Проверка дали текущият потребител е собственик
        if (!restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Нямате права да изтриете този ресторант.");
        }

        // 🧾 Изтриваме артикулите от поръчките на този ресторант
        List<Orders> restaurantOrders = ordersRepository.findByRestaurantId(id);
        for (Orders order : restaurantOrders) {
            orderItemsRepository.deleteByOrderId(order.getId());
        }

        // 🧾 Изтриваме самите поръчки
        ordersRepository.deleteAll(restaurantOrders);

        // 🍔 Изтриваме всички меню елементи за този ресторант
        menuItemsRepository.deleteByRestaurantsId(id);

        // 🏁 Накрая изтриваме ресторанта
        restaurantsRepository.deleteById(id);
    }


    @Override
    public List<Restaurants> filterRestaurantsByCategories(List<String> categories) {
        return restaurantsRepository.findDistinctByMenuItemsCategoryIn(categories);
    }

    public List<Restaurants> getRestaurantsByOwnerId(Long id) {
        return restaurantsRepository.findByOwnerId(id);
    }
}
