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

    // ✅ Преглед на всички ястия в менюто
    public List<MenuItems> getAllMenuItems() {
        return menuItemsRepository.findAll();
    }

    // ✅ Преглед на конкретно ястие по ID
    public Optional<MenuItems> getMenuItemById(Long id) {
        return menuItemsRepository.findById(id);
    }

    // ✅ Преглед на всички ястия за даден ресторант
    public List<MenuItems> getMenuItemsByRestaurant(Long restaurantId) {
        Optional<Restaurants> restaurantOpt = restaurantsRepository.findById(restaurantId);
        return restaurantOpt.map(menuItemsRepository::findByRestaurants).orElseThrow(
                () -> new RuntimeException("Ресторантът не е намерен!")
        );
    }

    // ✅ Добавяне на ново ястие в менюто (само за администратори/служители)
    public MenuItems addMenuItem(MenuItems menuItem, Long restaurantId) {
        Restaurants restaurant = restaurantsRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Ресторантът не съществува!"));

        menuItem.setRestaurants(restaurant);
        return menuItemsRepository.save(menuItem);
    }

    // ✅ Обновяване на ястие
    public MenuItems updateMenuItem(Long id, MenuItems updatedItem) {
        MenuItems existingItem = menuItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ястието не е намерено!"));

        existingItem.setName(updatedItem.getName());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setCategory(updatedItem.getCategory());

        return menuItemsRepository.save(existingItem);
    }

    // ✅ Изтриване на ястие (само администратори)
    public void deleteMenuItem(Long id) {
        if (!menuItemsRepository.existsById(id)) {
            throw new RuntimeException("Ястието не е намерено!");
        }
        menuItemsRepository.deleteById(id);
    }
}

