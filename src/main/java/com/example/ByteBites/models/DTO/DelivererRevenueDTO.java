package com.example.ByteBites.models.DTO;

import java.math.BigDecimal;

public class DelivererRevenueDTO {
    private Long delivererId;
    private String delivererUsername;
    private BigDecimal totalRevenue;

    public DelivererRevenueDTO(Long delivererId, String delivererUsername, BigDecimal totalRevenue) {
        this.delivererId = delivererId;
        this.delivererUsername = delivererUsername;
        this.totalRevenue = totalRevenue;
    }

    public Long getDelivererId() {
        return delivererId;
    }

    public String getDelivererName() {
        return delivererUsername;
    }

    public BigDecimal getTotalIncome() {
        return totalRevenue;
    }

    // Setters
    public void setDelivererId(Long delivererId) {
        this.delivererId = delivererId;
    }

    public void setDelivererName(String delivererName) {
        this.delivererUsername = delivererName;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalRevenue = totalIncome;
    }
}