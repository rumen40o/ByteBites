package com.example.ByteBites.controller;

import com.example.ByteBites.models.DTO.DelivererRevenueDTO;
import com.example.ByteBites.models.DTO.RestaurantPeriodRevenueDTO;
import com.example.ByteBites.models.DTO.RestaurantRevenueDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.example.ByteBites.service.inteface.ReportServiceInterface;
import com.example.ByteBites.models.DTO.OrderStatsDTO;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportServiceInterface reportService;

    // ✅ Manual constructor instead of @RequiredArgsConstructor
    public ReportController(ReportServiceInterface reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/order-stats")
    public ResponseEntity<OrderStatsDTO> getOrderStatistics() {
        OrderStatsDTO stats = reportService.getOrderStatistics();
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/restaurant-revenue")
    public ResponseEntity<?> getRestaurantRevenue(
            @RequestParam Long restaurantId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestHeader(name = "Authorization", required = false) String token
    ) {
        // If no time range, return all-time revenue for all restaurants
        if (start == null || end == null || token == null) {
            List<RestaurantRevenueDTO> allRevenue = reportService.getRevenuePerRestaurant();
            return ResponseEntity.ok(allRevenue);
        }

        // If time range is present, return for specific restaurant & owner
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;

        RestaurantPeriodRevenueDTO periodRevenue =
                reportService.getRestaurantRevenueForPeriod(restaurantId, start, end, jwt);

        return ResponseEntity.ok(periodRevenue);
    }

    @GetMapping("/deliverer-revenue")
    public ResponseEntity<DelivererRevenueDTO> getDelivererIncome(
            @RequestParam Long delivererId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestHeader(name = "Authorization") String token
    ) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        DelivererRevenueDTO income = reportService.getDelivererIncomeForPeriod(delivererId, start, end, jwt);
        return ResponseEntity.ok(income);
    }

}
