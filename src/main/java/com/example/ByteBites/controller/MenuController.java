package com.example.ByteBites.controller;

import com.example.ByteBites.models.MenuItems;
import com.example.ByteBites.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins =  "http://localhost:3000")
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;


    @GetMapping("/all")
    public ResponseEntity<List<MenuItems>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }


    @GetMapping("/{id}")
    public ResponseEntity<MenuItems> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItems> menuItem = menuService.getMenuItemById(id);
        return menuItem.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItems>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuService.getMenuItemsByRestaurant(restaurantId));
    }


    @PostMapping("/add/{restaurantId}")
    public ResponseEntity<MenuItems> addMenuItem(@RequestBody MenuItems menuItem, @PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuService.addMenuItem(menuItem, restaurantId));
    }


    @PutMapping("/{id}")
    public ResponseEntity<MenuItems> updateMenuItem(@PathVariable Long id, @RequestBody MenuItems menuItem) {
        return ResponseEntity.ok(menuService.updateMenuItem(id, menuItem));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok("Ястието беше изтрито успешно!");
    }
}

