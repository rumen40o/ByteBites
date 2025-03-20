package com.example.ByteBites.repository;

import com.example.ByteBites.models.MenuItems;
import com.example.ByteBites.models.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemsRepository extends JpaRepository<MenuItems, Long> {
    List<MenuItems> findByRestaurants(Restaurants restaurants);
}
