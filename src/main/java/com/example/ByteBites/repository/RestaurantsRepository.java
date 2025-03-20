package com.example.ByteBites.repository;

import com.example.ByteBites.models.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantsRepository extends JpaRepository<Restaurants, Long> {
}
