package com.example.ByteBites.controller;

import com.example.ByteBites.models.DTO.RestaurantRequestDTO;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin(origins = "http://localhost:3000")

public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @PostMapping("/add")
    public ResponseEntity<Restaurants> createRestaurant(@RequestBody RestaurantRequestDTO dto) {
        return ResponseEntity.ok(restaurantService.createRestaurant(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Restaurants>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurants> getRestaurantById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Restaurants> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantRequestDTO dto) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, dto));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok("Ресторантът беше успешно изтрит!");
    }
}

