package com.example.ByteBites.controller;

import com.example.ByteBites.models.*;
import com.example.ByteBites.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins ="http://localhost:3000")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<Orders>> getAvailableDeliveries() {
        return ResponseEntity.ok(deliveryService.getAvailableDeliveries());
    }

    @PostMapping("/accept/order/{orderId}/deliver/{deliverId}")
    public ResponseEntity<String> acceptDelivery(@PathVariable Long orderId, @PathVariable Long deliverId) {
        return ResponseEntity.ok(deliveryService.acceptDelivery(orderId, deliverId));
    }

    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long deliveryId, @RequestParam DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, status));
    }

    @GetMapping("/{deliverId}")
    public ResponseEntity<List<Deliveries>> getDeliveriesByDeliver(@PathVariable Long deliverId) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByDeliver(deliverId));
    }
}
