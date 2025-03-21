package com.example.ByteBites.service;

import com.example.ByteBites.models.MenuItems;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.MenuItemsRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemsRepository menuItemsRepository;
    private final RestaurantsRepository restaurantsRepository;


    public List<MenuItems> getAllMenuItems() {
        return menuItemsRepository.findAll();
    }


    public Optional<MenuItems> getMenuItemById(Long id) {
        return menuItemsRepository.findById(id);
    }


    public List<MenuItems> getMenuItemsByRestaurant(Long restaurantId) {
        Optional<Restaurants> restaurantOpt = restaurantsRepository.findById(restaurantId);
        return restaurantOpt.map(menuItemsRepository::findByRestaurants).orElseThrow(
                () -> new RuntimeException("Ресторантът не е намерен!")
        );
    }


    public MenuItems addMenuItem(MenuItems menuItem, Long restaurantId) {
        Restaurants restaurant = restaurantsRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Ресторантът не съществува!"));

        menuItem.setRestaurants(restaurant);
        return menuItemsRepository.save(menuItem);
    }


    public MenuItems updateMenuItem(Long id, MenuItems updatedItem) {
        MenuItems existingItem = menuItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ястието не е намерено!"));

        existingItem.setName(updatedItem.getName());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setCategory(updatedItem.getCategory());

        return menuItemsRepository.save(existingItem);
    }


    public void deleteMenuItem(Long id) {
        if (!menuItemsRepository.existsById(id)) {
            throw new RuntimeException("Ястието не е намерено!");
        }
        menuItemsRepository.deleteById(id);
    }
}

