package com.example.ByteBites.controller;

import com.example.ByteBites.models.*;
import com.example.ByteBites.service.DeliveryService;
import com.example.ByteBites.service.inteface.DeliveryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins ="http://localhost:3000")
public class DeliveryController {

    private final DeliveryServiceInterface deliveryService;

    public DeliveryController(DeliveryServiceInterface deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("/ready-for-pickup")
    @PreAuthorize("hasRole('DELIVER')")
    public ResponseEntity<List<Orders>> getReadyForPickupOrders(@AuthenticationPrincipal Accounts currentDeliverer) {
        List<Orders> readyForPickupOrders = deliveryService.getReadyForPickupOrders(currentDeliverer.getId());
        return ResponseEntity.ok(readyForPickupOrders);
    }

    @PostMapping("/accept/order/{orderId}")
    @PreAuthorize("hasRole('DELIVER')")
    public ResponseEntity<String> acceptDelivery(
            @PathVariable Long orderId,
            @AuthenticationPrincipal Accounts currentDeliverer) {
        return ResponseEntity.ok(deliveryService.acceptDelivery(orderId, currentDeliverer));
    }

    @PutMapping("/{deliveryId}/status")
    @PreAuthorize("hasRole('DELIVER')")
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long deliveryId, @RequestParam DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, status));
    }

    // 4. OWNER вижда поръчките по доставчик (ако е необходимо)
    @GetMapping("/{deliverId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Deliveries>> getDeliveriesByDeliver(@PathVariable Long deliverId) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByDeliver(deliverId));
    }

    // 5. OWNER приема поръчка (Променя статуса от PENDING на CONFIRMED)
    @PostMapping("/owner/accept/order/{orderId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<String> acceptOrderByOwner(@PathVariable Long orderId) {
        String result = deliveryService.acceptOrderByOwner(orderId);
        return ResponseEntity.ok(result);
    }

    // 6. OWNER маркира поръчката като готова за взимане (READY_FOR_PICKUP)
    @PostMapping("/owner/mark-ready/{orderId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<String> markOrderAsReady(@PathVariable Long orderId) {
        String result = deliveryService.markOrderAsReady(orderId);
        return ResponseEntity.ok(result);
    }
}
