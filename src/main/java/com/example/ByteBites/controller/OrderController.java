package com.example.ByteBites.controller;

import com.example.ByteBites.models.*;
import com.example.ByteBites.models.DTO.OrderRequestDTO;
import com.example.ByteBites.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins ="http://localhost:3000")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    @PostMapping("/create/customer/{customerId}/restaurant/{restaurantId}")
    public ResponseEntity<Orders> createOrder(
            @PathVariable Long customerId,
            @PathVariable Long restaurantId,
            @RequestBody OrderRequestDTO request) {
        return ResponseEntity.ok(orderService.createOrder(customerId, restaurantId, request));
    }



    @GetMapping
    public ResponseEntity<List<Orders>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }


    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Orders>> getOrdersByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }


    @PutMapping("/{orderId}/status")
    public ResponseEntity<Orders> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }


    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Поръчката беше изтрита успешно!");
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItems>> getOrderItems(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderItemsByOrder(orderId));
    }
}

