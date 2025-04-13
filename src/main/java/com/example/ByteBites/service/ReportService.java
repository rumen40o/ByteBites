package com.example.ByteBites.service;
import org.springframework.stereotype.Service;
import com.example.ByteBites.service.inteface.ReportServiceInterface;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.models.Orders;
import com.example.ByteBites.models.DTO.OrderStatsDTO;

import java.util.List;

@Service
public class ReportService implements ReportServiceInterface {

    private final OrdersRepository orderRepository;

    public ReportService(OrdersRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public OrderStatsDTO getOrderStatistics() {
        List<Orders> allOrders = orderRepository.findAll();
        int totalOrders = allOrders.size();
        double averageValue = totalOrders == 0 ? 0 : allOrders.stream()
                .mapToDouble(Orders::getTotalPrice)
                .average()
                .orElse(0);
        return new OrderStatsDTO(totalOrders, averageValue);
    }
}
