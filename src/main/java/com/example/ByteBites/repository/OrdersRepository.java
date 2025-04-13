package com.example.ByteBites.repository;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.OrderStatus;
import com.example.ByteBites.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomer(Accounts customer);

    List<Orders> findByStatus(OrderStatus status);

    List<Orders> findByRestaurantId(Long id);

    @Query("SELECT SUM(o.totalPrice) FROM Orders o")
    Double getTotalRevenue();
}
