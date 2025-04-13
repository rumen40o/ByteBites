package com.example.ByteBites.service.inteface;
import com.example.ByteBites.models.DTO.OrderStatsDTO;
import com.example.ByteBites.models.DTO.RestaurantRevenueDTO;

import java.util.List;

public interface ReportServiceInterface {
    OrderStatsDTO getOrderStatistics();
    List<RestaurantRevenueDTO> getRevenuePerRestaurant();
}

