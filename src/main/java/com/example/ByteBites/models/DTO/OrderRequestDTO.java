package com.example.ByteBites.models.DTO;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private String deliveryAddress;
    private List<OrderItemDTO> items;
}
