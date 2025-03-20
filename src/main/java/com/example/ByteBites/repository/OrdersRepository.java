package com.example.ByteBites.repository;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.OrderStatus;
import com.example.ByteBites.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomer(Accounts customer);

    List<Orders> findByStatus(OrderStatus status);
}
