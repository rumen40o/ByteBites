package com.example.ByteBites.controller;

import com.example.ByteBites.models.DTO.RestaurantRevenueDTO;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import com.example.ByteBites.service.inteface.ReportServiceInterface;
import com.example.ByteBites.models.DTO.OrderStatsDTO;

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
    public ResponseEntity<List<RestaurantRevenueDTO>> getRevenuePerRestaurant() {
        return ResponseEntity.ok(reportService.getRevenuePerRestaurant());
    }
}
