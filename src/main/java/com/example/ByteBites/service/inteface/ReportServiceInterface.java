package com.example.ByteBites.service.inteface;
import com.example.ByteBites.models.DTO.OrderStatsDTO;

public interface ReportServiceInterface {
    OrderStatsDTO getOrderStatistics();
}