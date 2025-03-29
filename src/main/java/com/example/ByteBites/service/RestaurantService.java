package com.example.ByteBites.service;


import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.RestaurantRequestDTO;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.service.inteface.RestaurantServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService implements RestaurantServiceInterface {

    private final RestaurantsRepository restaurantsRepository;

    public RestaurantService(RestaurantsRepository restaurantsRepository) {
        this.restaurantsRepository = restaurantsRepository;
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
    public Restaurants updateRestaurant(Long id, RestaurantRequestDTO dto) {
        Restaurants restaurant = restaurantsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ресторантът не е намерен!"));

        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setImageUrl(dto.getImageUrl());

        return restaurantsRepository.save(restaurant);
    }

    // Изтриване
    public void deleteRestaurant(Long id) {
        restaurantsRepository.deleteById(id);
    }
}
