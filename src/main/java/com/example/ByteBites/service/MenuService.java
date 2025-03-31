package com.example.ByteBites.service;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.MenuItems;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.MenuItemsRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.service.inteface.MenuServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService implements MenuServiceInterface {

    private final MenuItemsRepository menuItemsRepository;
    private final RestaurantsRepository restaurantsRepository;

    public MenuService(MenuItemsRepository menuItemsRepository, RestaurantsRepository restaurantsRepository) {
        this.menuItemsRepository = menuItemsRepository;
        this.restaurantsRepository = restaurantsRepository;
    }

    @Override
    public List<MenuItems> getAllMenuItems() {
        return menuItemsRepository.findAll();
    }

    @Override
    public Optional<MenuItems> getMenuItemById(Long id) {
        return menuItemsRepository.findById(id);
    }

    @Override
    public List<MenuItems> getMenuItemsByRestaurant(Long restaurantId) {
        Optional<Restaurants> restaurantOpt = restaurantsRepository.findById(restaurantId);
        return restaurantOpt.map(menuItemsRepository::findByRestaurants).orElseThrow(
                () -> new RuntimeException("Ресторантът не е намерен!")
        );
    }

    @Override
    public MenuItems addMenuItem(MenuItems menuItem, Long restaurantId, Accounts currentUser) {
        Restaurants restaurant = restaurantsRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Ресторантът не съществува!"));

        if (!restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нямате право да променяте това меню.");
        }

        menuItem.setRestaurants(restaurant);
        return menuItemsRepository.save(menuItem);
    }

    @Override
    public MenuItems updateMenuItem(Long id, MenuItems updatedItem, Accounts currentUser) {
        MenuItems existingItem = menuItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ястието не е намерено!"));


        if (!existingItem.getRestaurants().getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нямате право да редактирате това ястие.");
        }

        existingItem.setName(updatedItem.getName());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setCategory(updatedItem.getCategory());

        return menuItemsRepository.save(existingItem);
    }

    @Override
    public void deleteMenuItem(Long id, Accounts currentUser) {
        MenuItems item = menuItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Артикулът не е намерен"));

        if (!item.getRestaurants().getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нямате право да изтривате това ястие.");
        }

        menuItemsRepository.deleteById(id);
    }
}

