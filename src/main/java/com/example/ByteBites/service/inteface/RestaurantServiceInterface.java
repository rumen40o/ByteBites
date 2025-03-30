package com.example.ByteBites.service.inteface;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.RestaurantRequestDTO;
import com.example.ByteBites.models.Restaurants;

import java.util.List;
import java.util.Optional;

public interface RestaurantServiceInterface {
    Restaurants createRestaurant(RestaurantRequestDTO dto, Accounts currentUser);

    List<Restaurants> getAllRestaurants();

    Optional<Restaurants> getRestaurantById(Long id);

    Restaurants updateRestaurant(Long id, RestaurantRequestDTO dto);

    void deleteRestaurant(Long id);

    List<Restaurants> filterRestaurantsByCategories(List<String> categories);
}
